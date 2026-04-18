import { useMemo } from 'react'
import {
  PayoutAccountsStore,
  type PayoutAccountsState,
  type PayoutAccountsAction,
  type PortalClient,
} from '@monigo/portal-core'
import { useStore, type UseStoreResult } from './useStore'

export type UsePayoutAccountsResult = UseStoreResult<PayoutAccountsState, PayoutAccountsAction>

export function usePayoutAccounts(client: PortalClient): UsePayoutAccountsResult {
  const store = useMemo(() => new PayoutAccountsStore(client), [client])
  return useStore(store)
}
