import { useMemo } from 'react'
import { BillsStore, type BillsState, type BillsAction, type PortalClient } from '@monigo/portal-core'
import { useStore, type UseStoreResult } from './useStore'

export type UseBillsResult = UseStoreResult<BillsState, BillsAction>

export function useBills(client: PortalClient): UseBillsResult {
  const store = useMemo(() => new BillsStore(client), [client])
  return useStore(store)
}
