import { useMemo } from 'react'
import {
  InvoicesStore,
  type InvoicesState,
  type InvoicesAction,
  type PortalClient,
} from '@monigo/portal-core'
import { useStore, type UseStoreResult } from './useStore'

export type UseInvoicesResult = UseStoreResult<InvoicesState, InvoicesAction>

export function useInvoices(client: PortalClient): UseInvoicesResult {
  const store = useMemo(() => new InvoicesStore(client), [client])
  return useStore(store)
}
