import { BaseStore } from './store'
import type { PortalClient } from '../client'
import type { PortalInvoice, Bill, PortalWallet, PortalSubscription } from '../types'

export interface DashboardSnapshot {
  invoices: PortalInvoice[]
  bills: Bill[]
  subscriptions: PortalSubscription[]
  wallets: PortalWallet[]
  fetchedAt: number
}

export type DashboardState =
  | { status: 'idle' }
  | { status: 'loading'; snapshot?: DashboardSnapshot }
  | { status: 'ready'; snapshot: DashboardSnapshot }
  | { status: 'error'; error: Error; snapshot?: DashboardSnapshot }

export type DashboardAction = { type: 'load' } | { type: 'refresh' } | { type: 'reset' }

export class DashboardStore extends BaseStore<DashboardState, DashboardAction> {
  constructor(private readonly client: PortalClient) {
    super({ status: 'idle' })
  }

  protected async reduce(state: DashboardState, action: DashboardAction): Promise<DashboardState> {
    switch (action.type) {
      case 'reset':
        return { status: 'idle' }

      case 'load':
      case 'refresh': {
        // Synchronously emit loading so UI can render a skeleton while we fetch.
        const prevSnapshot = 'snapshot' in state ? state.snapshot : undefined
        this.setState({
          status: 'loading',
          ...(prevSnapshot !== undefined && { snapshot: prevSnapshot }),
        })

        try {
          const [inv, bills, subs, wallets] = await Promise.all([
            this.client.getInvoices(1, 100),
            this.client.getBills(1, 100),
            this.client.getSubscriptions().catch(() => ({ subscriptions: [], count: 0 })),
            this.client.getWallets().catch(() => ({ wallets: [], count: 0 })),
          ])
          return {
            status: 'ready',
            snapshot: {
              invoices: inv.invoices,
              bills: bills.bills,
              subscriptions: subs.subscriptions,
              wallets: wallets.wallets,
              fetchedAt: Date.now(),
            },
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err))
          return {
            status: 'error',
            error,
            ...(prevSnapshot !== undefined && { snapshot: prevSnapshot }),
          }
        }
      }
    }
  }
}
