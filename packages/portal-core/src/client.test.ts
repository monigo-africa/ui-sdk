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
})
