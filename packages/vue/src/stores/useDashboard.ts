import {
  DashboardStore,
  type DashboardState,
  type DashboardAction,
  type PortalClient,
} from '@monigo/portal-core'
import { useStore, type UseStoreResult } from './useStore'

export type UseDashboardResult = UseStoreResult<DashboardState, DashboardAction>

export function useDashboard(client: PortalClient): UseDashboardResult {
  const store = new DashboardStore(client)
  return useStore<DashboardState, DashboardAction>(store)
}
