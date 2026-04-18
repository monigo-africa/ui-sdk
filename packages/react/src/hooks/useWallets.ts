import { useMemo } from 'react'
import { WalletsStore, type WalletsState, type WalletsAction, type PortalClient } from '@monigo/portal-core'
import { useStore, type UseStoreResult } from './useStore'

export type UseWalletsResult = UseStoreResult<WalletsState, WalletsAction>

export function useWallets(client: PortalClient): UseWalletsResult {
  const store = useMemo(() => new WalletsStore(client), [client])
  return useStore(store)
}
