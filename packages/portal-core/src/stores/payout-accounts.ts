import { BaseStore } from './store'
import type { PortalClient } from '../client'
import type { CustomerPayoutAccount } from '../types'

export type PayoutAccountsState =
  | { status: 'idle' }
  | { status: 'loading'; payoutAccounts?: CustomerPayoutAccount[] }
  | { status: 'ready'; payoutAccounts: CustomerPayoutAccount[]; fetchedAt: number }
  | { status: 'error'; error: Error; payoutAccounts?: CustomerPayoutAccount[] }

export type PayoutAccountsAction = { type: 'load' } | { type: 'refresh' } | { type: 'reset' }

export class PayoutAccountsStore extends BaseStore<PayoutAccountsState, PayoutAccountsAction> {
  constructor(private readonly client: PortalClient) {
    super({ status: 'idle' })
  }

  protected async reduce(state: PayoutAccountsState, action: PayoutAccountsAction): Promise<PayoutAccountsState> {
    switch (action.type) {
      case 'reset':
        return { status: 'idle' }

      case 'load':
      case 'refresh': {
        // Synchronously emit loading so UI can render a skeleton while we fetch.
        const prevPayoutAccounts = 'payoutAccounts' in state && state.payoutAccounts ? state.payoutAccounts : undefined
        this.setState({
          status: 'loading',
          ...(prevPayoutAccounts !== undefined && { payoutAccounts: prevPayoutAccounts }),
        })

        try {
          const res = await this.client.getPayoutAccounts()
          return {
            status: 'ready',
            payoutAccounts: res.payout_accounts,
            fetchedAt: Date.now(),
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err))
          return {
            status: 'error',
            error,
            ...(prevPayoutAccounts !== undefined && { payoutAccounts: prevPayoutAccounts }),
          }
        }
      }
    }
  }
}
