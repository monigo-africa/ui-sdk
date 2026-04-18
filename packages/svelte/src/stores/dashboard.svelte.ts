import { DashboardStore, type DashboardState, type DashboardAction, type PortalClient } from '@monigo/portal-core'
import { RuneStore } from './base-rune.svelte'

export type DashboardRune = RuneStore<DashboardState, DashboardAction>

export function createDashboardRune(client: PortalClient): DashboardRune {
  return new RuneStore(new DashboardStore(client))
}
