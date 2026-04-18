import { useMemo } from 'react'
import {
  SubscriptionsStore,
  type SubscriptionsState,
  type SubscriptionsAction,
  type PortalClient,
} from '@monigo/portal-core'
import { useStore, type UseStoreResult } from './useStore'

export type UseSubscriptionsResult = UseStoreResult<SubscriptionsState, SubscriptionsAction>

export function useSubscriptions(client: PortalClient): UseSubscriptionsResult {
  const store = useMemo(() => new SubscriptionsStore(client), [client])
  return useStore(store)
}
