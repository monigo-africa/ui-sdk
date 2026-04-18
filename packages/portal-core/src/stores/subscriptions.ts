import { BaseStore } from './store'
import type { PortalClient } from '../client'
import type { PortalSubscription } from '../types'

export type SubscriptionsState =
  | { status: 'idle' }
  | { status: 'loading'; subscriptions?: PortalSubscription[] }
  | { status: 'ready'; subscriptions: PortalSubscription[]; count: number; fetchedAt: number }
  | { status: 'error'; error: Error; subscriptions?: PortalSubscription[] }

export type SubscriptionsAction = { type: 'load' } | { type: 'refresh' } | { type: 'reset' }

export class SubscriptionsStore extends BaseStore<SubscriptionsState, SubscriptionsAction> {
  constructor(private readonly client: PortalClient) {
    super({ status: 'idle' })
  }

  protected async reduce(state: SubscriptionsState, action: SubscriptionsAction): Promise<SubscriptionsState> {
    switch (action.type) {
      case 'reset':
        return { status: 'idle' }

      case 'load':
      case 'refresh': {
        // Synchronously emit loading so UI can render a skeleton while we fetch.
        const prevSubscriptions = 'subscriptions' in state && state.subscriptions ? state.subscriptions : undefined
        this.setState({
          status: 'loading',
          ...(prevSubscriptions !== undefined && { subscriptions: prevSubscriptions }),
        })

        try {
          const res = await this.client.getSubscriptions()
          return {
            status: 'ready',
            subscriptions: res.subscriptions,
            count: res.count,
            fetchedAt: Date.now(),
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err))
          return {
            status: 'error',
            error,
            ...(prevSubscriptions !== undefined && { subscriptions: prevSubscriptions }),
          }
        }
      }
    }
  }
}
