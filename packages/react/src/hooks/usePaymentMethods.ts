import { useMemo } from 'react'
import {
  PaymentMethodsStore,
  type PaymentMethodsState,
  type PaymentMethodsAction,
  type PortalClient,
} from '@monigo/portal-core'
import { useStore, type UseStoreResult } from './useStore'

export type UsePaymentMethodsResult = UseStoreResult<PaymentMethodsState, PaymentMethodsAction>

export function usePaymentMethods(client: PortalClient): UsePaymentMethodsResult {
  const store = useMemo(() => new PaymentMethodsStore(client), [client])
  return useStore(store)
}
