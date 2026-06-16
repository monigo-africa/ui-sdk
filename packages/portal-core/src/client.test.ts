import { describe, it, expect, vi } from 'vitest'
import { PortalClient } from './client'
import { PortalApiError, PortalUnauthorizedError } from './errors'

function mockFetch(response: { status: number; body: unknown }) {
  return vi.fn(async () => ({
    ok: response.status >= 200 && response.status < 300,
    status: response.status,
    json: async () => response.body,
  }) as unknown as Response)
}

describe('PortalClient', () => {
  it('sends X-Portal-Token header on every request', async () => {
    const fetch = mockFetch({ status: 200, body: { customer_id: 'c_1' } })
    const client = new PortalClient({ portalToken: 'tok_abc', baseUrl: 'https://api.test/v1', fetch })
    await client.getMe()
    expect(fetch).toHaveBeenCalledOnce()
    const [url, init] = fetch.mock.calls[0]!
    expect(url).toBe('https://api.test/v1/portal/me')
    expect((init as RequestInit).headers).toMatchObject({
      'X-Portal-Token': 'tok_abc',
      'Content-Type': 'application/json',
    })
  })

  it('serialises JSON bodies on POST', async () => {
    const fetch = mockFetch({ status: 200, body: { message: 'ok' } })
    const client = new PortalClient({ portalToken: 't', fetch })
    await client.fundWallet('w_1', { amount: '100', currency: 'NGN' })
    const [, init] = fetch.mock.calls[0]!
    expect((init as RequestInit).method).toBe('POST')
    expect((init as RequestInit).body).toBe('{"amount":"100","currency":"NGN"}')
  })

  it('throws PortalUnauthorizedError on 401', async () => {
    const fetch = mockFetch({ status: 401, body: { error: 'invalid token' } })
    const client = new PortalClient({ portalToken: 'bad', fetch })
    await expect(client.getMe()).rejects.toBeInstanceOf(PortalUnauthorizedError)
  })

  it('throws PortalApiError on other non-2xx', async () => {
    const fetch = mockFetch({ status: 500, body: { error: 'boom' } })
    const client = new PortalClient({ portalToken: 't', fetch })
    await expect(client.getMe()).rejects.toBeInstanceOf(PortalApiError)
  })

  it('defaults baseUrl to production when not provided', async () => {
    const fetch = mockFetch({ status: 200, body: { customer_id: 'c_1' } })
    const client = new PortalClient({ portalToken: 't', fetch })
    await client.getMe()
    const [url] = fetch.mock.calls[0]!
    expect(url).toMatch(/^https:\/\/api\.monigo\.co\/api\/v1\//)
  })

  it('cancelSubscription posts to the correct URL', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ message: 'subscription canceled' }) })
    const client = new PortalClient({ portalToken: 'tok', fetch })
    const result = await client.cancelSubscription('sub-123')
    expect(result).toEqual({ message: 'subscription canceled' })
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/portal/subscriptions/sub-123/cancel'),
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('setupPaymentMethod posts to the correct URL and returns authorization_url', async () => {
    const fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'Payment method setup initiated', authorization_url: 'https://checkout.paystack.com/xxx', reference: 'card-setup-abc', provider: 'paystack' })
    })
    const client = new PortalClient({ portalToken: 'tok', fetch })
    const result = await client.setupPaymentMethod()
    expect(result.authorization_url).toBe('https://checkout.paystack.com/xxx')
    expect(result.provider).toBe('paystack')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/portal/payment-methods/setup'),
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('setupPaymentMethod propagates 501 as PortalApiError', async () => {
    const fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 501,
      json: () => Promise.resolve({ error: 'payment method setup not supported for this provider' })
    })
    const client = new PortalClient({ portalToken: 'tok', fetch })
    await expect(client.setupPaymentMethod()).rejects.toThrow(PortalApiError)
  })
})

describe('initWalletFunding', () => {
  it('POSTs inline:true and returns the funding session', async () => {
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body))
      expect(body).toEqual({ amount: '5000.00', currency: 'NGN', inline: true })
      return {
        ok: true,
        status: 200,
        json: async () => ({
          provider: 'paystack',
          reference: 'wf_abc_1',
          amount: '5000.00',
          currency: 'NGN',
          email: 'c@example.com',
          customer_name: 'Jane',
          public_key: 'pk_test_x',
          access_code: 'ac_1',
          meta: { purpose: 'wallet_funding' },
        }),
      } as unknown as Response
    })
    const client = new PortalClient({ portalToken: 't', fetch: fetchMock as unknown as typeof fetch })

    const session = await client.initWalletFunding('wal_1', { amount: '5000.00', currency: 'NGN' })

    expect(session.provider).toBe('paystack')
    expect(session.public_key).toBe('pk_test_x')
    expect(session.access_code).toBe('ac_1')
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/portal/wallets/wal_1/fund'),
      expect.objectContaining({ method: 'POST' }),
    )
  })
})
