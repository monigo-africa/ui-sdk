import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'

const { launchCheckout, refreshNow, createBalancePoller } = vi.hoisted(() => {
  const refreshNow = vi.fn(async () => {})
  return {
    refreshNow,
    launchCheckout: vi.fn(async () => ({ status: 'success', reference: 'wf_1' })),
    createBalancePoller: vi.fn((_c: unknown, _id: string, opts: { onBalance: (b: string, w: unknown) => void }) => ({
      start: () => opts.onBalance('5000', { status: 'active' }),
      stop: vi.fn(),
      refreshNow,
    })),
  }
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
  useMonigoContext: () => ({ client, messages: { 'wallets.action.fund': 'Fund wallet', 'common.confirm': 'Confirm', 'common.cancel': 'Cancel', 'common.loading': 'Loading…' }, locale: 'en-US', theme: {} }),
}))

import { WalletWidget } from './WalletWidget'

beforeEach(() => { launchCheckout.mockClear(); refreshNow.mockClear(); client.initWalletFunding.mockClear() })
afterEach(() => { cleanup() })

describe('WalletWidget', () => {
  it('shows the live balance', async () => {
    render(<WalletWidget walletId="wal_1" currency="NGN" />)
    await waitFor(() => expect(screen.getByText(/5,000|5000/)).toBeTruthy())
  })

  it('funds via inline checkout and refreshes', async () => {
    render(<WalletWidget walletId="wal_1" currency="NGN" />)
    fireEvent.click(screen.getByRole('button', { name: /fund wallet/i }))
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '1000' } })
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }))
    await waitFor(() => expect(client.initWalletFunding).toHaveBeenCalledWith('wal_1', { amount: '1000', currency: 'NGN' }))
    expect(launchCheckout).toHaveBeenCalled()
    await waitFor(() => expect(refreshNow).toHaveBeenCalled())
  })

  it('passes a mount element + abort signal to launchCheckout for Stripe', async () => {
    client.initWalletFunding.mockResolvedValueOnce({ provider: 'stripe', reference: 'wf_s', amount: '1000', currency: 'NGN', email: 'c@x.com', customer_name: 'J', public_key: 'pk', client_secret: 'cs', meta: {} })
    render(<WalletWidget walletId="wal_1" currency="NGN" />)
    fireEvent.click(screen.getByRole('button', { name: /fund wallet/i }))
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '1000' } })
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }))
    await waitFor(() => expect(launchCheckout).toHaveBeenCalled())
    const opts = (launchCheckout.mock.calls.at(-1) as unknown[])[1] as { mountEl?: unknown; signal?: unknown }
    expect(opts.mountEl).toBeInstanceOf(HTMLElement)
    expect(opts.signal).toBeInstanceOf(AbortSignal)
  })
})
