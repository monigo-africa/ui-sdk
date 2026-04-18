import { BaseStore } from './store'
import type { PortalClient } from '../client'
import type { PortalInvoice } from '../types'

export type InvoicesState =
  | { status: 'idle' }
  | { status: 'loading'; invoices?: PortalInvoice[] }
  | { status: 'ready'; invoices: PortalInvoice[]; count: number; page: number; limit: number; fetchedAt: number }
  | { status: 'error'; error: Error; invoices?: PortalInvoice[] }

export type InvoicesAction =
  | { type: 'load'; page?: number; limit?: number }
  | { type: 'refresh' }
  | { type: 'reset' }

export class InvoicesStore extends BaseStore<InvoicesState, InvoicesAction> {
  private lastParams: { page: number; limit: number } = { page: 1, limit: 20 }

  constructor(private readonly client: PortalClient) {
    super({ status: 'idle' })
  }

  protected async reduce(state: InvoicesState, action: InvoicesAction): Promise<InvoicesState> {
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
        this.setState({
          status: 'loading',
          invoices: 'invoices' in state && state.invoices ? state.invoices : undefined,
        })

        try {
          const res = await this.client.getInvoices(params.page, params.limit)
          return {
            status: 'ready',
            invoices: res.invoices,
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
            invoices: 'invoices' in state && state.invoices ? state.invoices : undefined,
          }
        }
      }
    }
  }
}
