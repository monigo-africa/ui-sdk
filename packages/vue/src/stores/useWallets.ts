import { WalletsStore, type WalletsState, type WalletsAction, type PortalClient } from '@monigo/portal-core'
import { useStore, type UseStoreResult } from './useStore'

export type UseWalletsResult = UseStoreResult<WalletsState, WalletsAction>

export function useWallets(client: PortalClient): UseWalletsResult {
  const store = new WalletsStore(client)
  return useStore<WalletsState, WalletsAction>(store)
}
