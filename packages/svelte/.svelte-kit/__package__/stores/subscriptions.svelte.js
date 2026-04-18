import { SubscriptionsStore } from '@monigo/portal-core';
import { RuneStore } from './base-rune.svelte';
export function createSubscriptionsRune(client) {
    return new RuneStore(new SubscriptionsStore(client));
}
