import { SubscriptionsStore, type SubscriptionsState, type SubscriptionsAction, type PortalClient } from '@monigo/portal-core'
import { RuneStore } from './base-rune.svelte'

export type SubscriptionsRune = RuneStore<SubscriptionsState, SubscriptionsAction>

export function createSubscriptionsRune(client: PortalClient): SubscriptionsRune {
  return new RuneStore(new SubscriptionsStore(client))
}
