import {
  PaymentMethodsStore,
  type PaymentMethodsState,
  type PaymentMethodsAction,
  type PortalClient,
} from '@monigo/portal-core'
import { useStore, type UseStoreResult } from './useStore'

export type UsePaymentMethodsResult = UseStoreResult<PaymentMethodsState, PaymentMethodsAction>

export function usePaymentMethods(client: PortalClient): UsePaymentMethodsResult {
  const store = new PaymentMethodsStore(client)
  return useStore<PaymentMethodsState, PaymentMethodsAction>(store)
}
