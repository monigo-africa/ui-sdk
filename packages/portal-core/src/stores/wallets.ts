import { BaseStore } from './store'
import type { PortalClient } from '../client'
import type { PortalWallet } from '../types'

export type WalletsState =
  | { status: 'idle' }
  | { status: 'loading'; wallets?: PortalWallet[] }
  | { status: 'ready'; wallets: PortalWallet[]; count: number; fetchedAt: number }
  | { status: 'error'; error: Error; wallets?: PortalWallet[] }

export type WalletsAction = { type: 'load' } | { type: 'refresh' } | { type: 'reset' }

export class WalletsStore extends BaseStore<WalletsState, WalletsAction> {
  constructor(private readonly client: PortalClient) {
    super({ status: 'idle' })
  }

  protected async reduce(state: WalletsState, action: WalletsAction): Promise<WalletsState> {
    switch (action.type) {
      case 'reset':
        return { status: 'idle' }

      case 'load':
      case 'refresh': {
        // Synchronously emit loading so UI can render a skeleton while we fetch.
        const prevWallets = 'wallets' in state && state.wallets ? state.wallets : undefined
        this.setState({
          status: 'loading',
          ...(prevWallets !== undefined && { wallets: prevWallets }),
        })

        try {
          const res = await this.client.getWallets()
          return {
            status: 'ready',
            wallets: res.wallets,
            count: res.count,
            fetchedAt: Date.now(),
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err))
          return {
            status: 'error',
            error,
            ...(prevWallets !== undefined && { wallets: prevWallets }),
          }
        }
      }
    }
  }
}
