import { BillsStore } from '@monigo/portal-core';
import { RuneStore } from './base-rune.svelte';
export function createBillsRune(client) {
    return new RuneStore(new BillsStore(client));
}
