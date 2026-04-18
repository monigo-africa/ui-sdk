import {
  InvoicesStore,
  type InvoicesState,
  type InvoicesAction,
  type PortalClient,
} from '@monigo/portal-core'
import { useStore, type UseStoreResult } from './useStore'

export type UseInvoicesResult = UseStoreResult<InvoicesState, InvoicesAction>

export function useInvoices(client: PortalClient): UseInvoicesResult {
  const store = new InvoicesStore(client)
  return useStore<InvoicesState, InvoicesAction>(store)
}
