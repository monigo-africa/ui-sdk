import { BaseStore } from './store'
import type { PortalClient } from '../client'
import type { CustomerPaymentMethod } from '../types'

export type PaymentMethodsState =
  | { status: 'idle' }
  | { status: 'loading'; paymentMethods?: CustomerPaymentMethod[] }
  | { status: 'ready'; paymentMethods: CustomerPaymentMethod[]; fetchedAt: number }
  | { status: 'error'; error: Error; paymentMethods?: CustomerPaymentMethod[] }

export type PaymentMethodsAction = { type: 'load' } | { type: 'refresh' } | { type: 'reset' }

export class PaymentMethodsStore extends BaseStore<PaymentMethodsState, PaymentMethodsAction> {
  constructor(private readonly client: PortalClient) {
    super({ status: 'idle' })
  }

  protected async reduce(state: PaymentMethodsState, action: PaymentMethodsAction): Promise<PaymentMethodsState> {
    switch (action.type) {
      case 'reset':
        return { status: 'idle' }

      case 'load':
      case 'refresh': {
        // Synchronously emit loading so UI can render a skeleton while we fetch.
        const prevPaymentMethods = 'paymentMethods' in state && state.paymentMethods ? state.paymentMethods : undefined
        this.setState({
          status: 'loading',
          ...(prevPaymentMethods !== undefined && { paymentMethods: prevPaymentMethods }),
        })

        try {
          const res = await this.client.getPaymentMethods()
          return {
            status: 'ready',
            paymentMethods: res.payment_methods,
            fetchedAt: Date.now(),
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err))
          return {
            status: 'error',
            error,
            ...(prevPaymentMethods !== undefined && { paymentMethods: prevPaymentMethods }),
          }
        }
      }
    }
  }
}
