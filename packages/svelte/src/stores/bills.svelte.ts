import { BillsStore, type BillsState, type BillsAction, type PortalClient } from '@monigo/portal-core'
import { RuneStore } from './base-rune.svelte'

export type BillsRune = RuneStore<BillsState, BillsAction>

export function createBillsRune(client: PortalClient): BillsRune {
  return new RuneStore(new BillsStore(client))
}
