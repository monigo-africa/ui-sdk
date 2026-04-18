import { PayoutAccountsStore, type PayoutAccountsState, type PayoutAccountsAction, type PortalClient } from '@monigo/portal-core'
import { RuneStore } from './base-rune.svelte'

export type PayoutAccountsRune = RuneStore<PayoutAccountsState, PayoutAccountsAction>

export function createPayoutAccountsRune(client: PortalClient): PayoutAccountsRune {
  return new RuneStore(new PayoutAccountsStore(client))
}
