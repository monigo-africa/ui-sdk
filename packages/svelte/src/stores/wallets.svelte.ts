import { WalletsStore, type WalletsState, type WalletsAction, type PortalClient } from '@monigo/portal-core'
import { RuneStore } from './base-rune.svelte'

export type WalletsRune = RuneStore<WalletsState, WalletsAction>

export function createWalletsRune(client: PortalClient): WalletsRune {
  return new RuneStore(new WalletsStore(client))
}
