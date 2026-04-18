import { BaseStore } from './store'
import type { PortalClient } from '../client'
import type { Bill } from '../types'

export type BillsState =
  | { status: 'idle' }
  | { status: 'loading'; bills?: Bill[] }
  | { status: 'ready'; bills: Bill[]; count: number; page: number; limit: number; fetchedAt: number }
  | { status: 'error'; error: Error; bills?: Bill[] }

export type BillsAction =
  | { type: 'load'; page?: number; limit?: number }
  | { type: 'refresh' }
  | { type: 'reset' }

export class BillsStore extends BaseStore<BillsState, BillsAction> {
  private lastParams: { page: number; limit: number } = { page: 1, limit: 20 }

  constructor(private readonly client: PortalClient) {
    super({ status: 'idle' })
  }

  protected async reduce(state: BillsState, action: BillsAction): Promise<BillsState> {
    switch (action.type) {
      case 'reset':
        return { status: 'idle' }

      case 'load':
      case 'refresh': {
        const params =
          action.type === 'load'
            ? { page: action.page ?? 1, limit: action.limit ?? 20 }
            : this.lastParams
        this.lastParams = params

        // Synchronously emit loading so UI can render a skeleton while we fetch.
        const prevBills = 'bills' in state && state.bills ? state.bills : undefined
        this.setState({
          status: 'loading',
          ...(prevBills !== undefined && { bills: prevBills }),
        })

        try {
          const res = await this.client.getBills(params.page, params.limit)
          return {
            status: 'ready',
            bills: res.bills,
            count: res.count,
            page: params.page,
            limit: params.limit,
            fetchedAt: Date.now(),
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err))
          return {
            status: 'error',
            error,
            ...(prevBills !== undefined && { bills: prevBills }),
          }
        }
      }
    }
  }
}
