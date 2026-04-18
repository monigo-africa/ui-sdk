import { PayoutAccountsStore } from '@monigo/portal-core';
import { RuneStore } from './base-rune.svelte';
export function createPayoutAccountsRune(client) {
    return new RuneStore(new PayoutAccountsStore(client));
}
