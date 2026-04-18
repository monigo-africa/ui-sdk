import { InvoicesStore, type InvoicesState, type InvoicesAction, type PortalClient } from '@monigo/portal-core'
import { RuneStore } from './base-rune.svelte'

export type InvoicesRune = RuneStore<InvoicesState, InvoicesAction>

export function createInvoicesRune(client: PortalClient): InvoicesRune {
  return new RuneStore(new InvoicesStore(client))
}
