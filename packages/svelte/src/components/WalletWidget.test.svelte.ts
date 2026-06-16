import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/svelte'

const { launchCheckout, refreshNow, createBalancePoller } = vi.hoisted(() => {
  const refreshNow = vi.fn(async () => {})
  const launchCheckout = vi.fn(async () => ({ status: 'success', reference: 'wf_1' }))
  const createBalancePoller = vi.fn((_c: unknown, _id: string, opts: { onBalance: (b: string, w: unknown) => void }) => {
    return { start: () => opts.onBalance('5000', { status: 'active' }), stop: vi.fn(), refreshNow }
  })
  return { launchCheckout, refreshNow, createBalancePoller }
})

vi.mock('@monigo/portal-core', async (orig) => {
  const actual = await (orig() as Promise<Record<string, unknown>>)
  return { ...actual, launchCheckout, createBalancePoller }
})

const client = {
  initWalletFunding: vi.fn(async () => ({ provider: 'paystack', reference: 'wf_1', amount: '1000', currency: 'NGN', email: 'c@x.com', customer_name: 'J', public_key: 'pk', access_code: 'ac', meta: {} })),
  fundWallet: vi.fn(),
  getWallet: vi.fn(),
}
vi.mock('../provider/context', () => ({
  getMonigoContext: () => ({ client, messages: { 'wallets.action.fund': 'Fund wallet', 'common.cancel': 'Cancel', 'common.loading': 'Loading…', 'common.confirm': 'Confirm' }, locale: 'en-US', theme: {} }),
}))

import WalletWidget from './WalletWidget.svelte'

beforeEach(() => { launchCheckout.mockClear(); refreshNow.mockClear(); client.initWalletFunding.mockClear() })
afterEach(() => cleanup())

describe('WalletWidget', () => {
  it('shows the live balance emitted by the poller', async () => {
    render(WalletWidget, { props: { walletId: 'wal_1', currency: 'NGN' } })
    await waitFor(() => expect(screen.getByText(/5,000|5000/)).toBeTruthy())
  })

  it('funds via inline checkout and refreshes', async () => {
    render(WalletWidget, { props: { walletId: 'wal_1', currency: 'NGN' } })
    await fireEvent.click(screen.getByRole('button', { name: /fund wallet/i }))
    const input = screen.getByPlaceholderText(/amount/i)
    await fireEvent.input(input, { target: { value: '1000' } })
    await fireEvent.click(screen.getByRole('button', { name: /confirm/i }))

    await waitFor(() => expect(client.initWalletFunding).toHaveBeenCalledWith('wal_1', { amount: '1000', currency: 'NGN' }))
    expect(launchCheckout).toHaveBeenCalled()
    await waitFor(() => expect(refreshNow).toHaveBeenCalled())
  })

  it('passes a mount element + abort signal to launchCheckout for Stripe', async () => {
    client.initWalletFunding.mockResolvedValueOnce({ provider: 'stripe', reference: 'wf_s', amount: '1000', currency: 'NGN', email: 'c@x.com', customer_name: 'J', public_key: 'pk', client_secret: 'cs', meta: {} })
    render(WalletWidget, { props: { walletId: 'wal_1', currency: 'NGN' } })
    await fireEvent.click(screen.getByRole('button', { name: /fund wallet/i }))
    await fireEvent.input(screen.getByPlaceholderText(/amount/i), { target: { value: '1000' } })
    await fireEvent.click(screen.getByRole('button', { name: /confirm/i }))
    await waitFor(() => expect(launchCheckout).toHaveBeenCalled())
    const opts = (launchCheckout.mock.calls.at(-1) as unknown[])[1] as { mountEl?: unknown; signal?: unknown }
    expect(opts.mountEl).toBeInstanceOf(HTMLElement)
    expect(opts.signal).toBeInstanceOf(AbortSignal)
  })
})
