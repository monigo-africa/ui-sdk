import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

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

import WalletWidget from './WalletWidget.vue'

beforeEach(() => { launchCheckout.mockClear(); refreshNow.mockClear(); client.initWalletFunding.mockClear() })

describe('WalletWidget', () => {
  it('shows the live balance', async () => {
    const w = mount(WalletWidget, { props: { walletId: 'wal_1', currency: 'NGN' } })
    await flushPromises()
    expect(w.text()).toMatch(/5,000|5000/)
  })

  it('funds via inline checkout and refreshes', async () => {
    const w = mount(WalletWidget, { props: { walletId: 'wal_1', currency: 'NGN' } })
    await flushPromises()
    await w.find('button.primary').trigger('click')   // open form
    await w.find('input').setValue('1000')
    await w.find('form').trigger('submit')
    await flushPromises()
    expect(client.initWalletFunding).toHaveBeenCalledWith('wal_1', { amount: '1000', currency: 'NGN' })
    expect(launchCheckout).toHaveBeenCalled()
    await flushPromises()
    expect(refreshNow).toHaveBeenCalled()
  })

  it('passes a mount element + abort signal to launchCheckout for Stripe', async () => {
    client.initWalletFunding.mockResolvedValueOnce({ provider: 'stripe', reference: 'wf_s', amount: '1000', currency: 'NGN', email: 'c@x.com', customer_name: 'J', public_key: 'pk', client_secret: 'cs', meta: {} })
    const w = mount(WalletWidget, { props: { walletId: 'wal_1', currency: 'NGN' }, attachTo: document.body })
    await flushPromises()
    await w.find('button.primary').trigger('click')
    await w.find('input').setValue('1000')
    await w.find('form').trigger('submit')
    await flushPromises()
    expect(launchCheckout).toHaveBeenCalled()
    const opts = (launchCheckout.mock.calls.at(-1) as unknown[])[1] as { mountEl?: unknown; signal?: unknown }
    expect(opts.mountEl).toBeInstanceOf(HTMLElement)
    expect(opts.signal).toBeInstanceOf(AbortSignal)
    w.unmount()
  })
})
