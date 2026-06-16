import type { PortalClient } from './client'
import type { PortalWallet } from './types'

export interface BalancePollerOptions {
  intervalMs?: number
  onBalance: (balance: string, wallet: PortalWallet) => void
  onError?: (err: unknown) => void
}

export interface BalancePoller {
  start(): void
  stop(): void
  /** Fetch once now (used for aggressive refresh right after funding). */
  refreshNow(): Promise<void>
}

/** Poll a wallet's balance on an interval. Pauses while the tab is hidden. */
export function createBalancePoller(
  client: PortalClient,
  walletId: string,
  opts: BalancePollerOptions,
): BalancePoller {
  const intervalMs = opts.intervalMs ?? 8000
  let timer: ReturnType<typeof setInterval> | undefined
  let inFlight = false

  async function tick(): Promise<void> {
    inFlight = true
    try {
      const { wallet } = await client.getWallet(walletId)
      opts.onBalance(wallet.balance, wallet)
    } catch (err) {
      opts.onError?.(err)
    } finally {
      inFlight = false
    }
  }

  return {
    start() {
      if (timer) return
      void tick()
      timer = setInterval(() => {
        if (typeof document !== 'undefined' && document.hidden) return
        if (inFlight) return // skip if a previous poll is still in-flight (slow network / batched timers)
        void tick()
      }, intervalMs)
    },
    stop() {
      if (timer) {
        clearInterval(timer)
        timer = undefined
      }
    },
    refreshNow: tick,
  }
}
