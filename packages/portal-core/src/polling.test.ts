import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createBalancePoller } from './polling'
import { PortalClient } from './client'

function makeClient(getWallet: PortalClient['getWallet']): PortalClient {
  return Object.assign(Object.create((PortalClient as unknown as { prototype: object }).prototype), { getWallet }) as PortalClient
}

describe('createBalancePoller', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('emits balance immediately and on each interval', async () => {
    let n = 0
    const getWallet = vi.fn(async () => ({ wallet: { id: 'w', currency: 'NGN', balance: String(++n), status: 'active', virtual_accounts: [], created_at: '' } }))
    const seen: string[] = []
    const poller = createBalancePoller(makeClient(getWallet as unknown as PortalClient['getWallet']), 'w', {
      intervalMs: 1000,
      onBalance: (b) => seen.push(b),
    })

    poller.start()
    await vi.advanceTimersByTimeAsync(0)     // immediate tick
    await vi.advanceTimersByTimeAsync(1000)  // first interval
    poller.stop()
    await vi.advanceTimersByTimeAsync(5000)  // no further ticks after stop

    expect(seen).toEqual(['1', '2'])
    expect(getWallet).toHaveBeenCalledTimes(2)
  })

  it('routes fetch failures to onError and keeps polling', async () => {
    const getWallet = vi.fn(async () => { throw new Error('network down') })
    const errors: unknown[] = []
    const poller = createBalancePoller(makeClient(getWallet as unknown as PortalClient['getWallet']), 'w', {
      intervalMs: 1000,
      onBalance: () => { throw new Error('onBalance should not be called') },
      onError: (e) => errors.push(e),
    })

    poller.start()
    await vi.advanceTimersByTimeAsync(0)
    poller.stop()

    expect(errors).toHaveLength(1)
    expect((errors[0] as Error).message).toBe('network down')
  })

  it('refreshNow fetches on demand without start()', async () => {
    const getWallet = vi.fn(async () => ({ wallet: { id: 'w', currency: 'NGN', balance: '42', status: 'active', virtual_accounts: [], created_at: '' } }))
    const seen: string[] = []
    const poller = createBalancePoller(makeClient(getWallet as unknown as PortalClient['getWallet']), 'w', {
      onBalance: (b) => seen.push(b),
    })

    await poller.refreshNow()

    expect(seen).toEqual(['42'])
    expect(getWallet).toHaveBeenCalledTimes(1)
  })
})
