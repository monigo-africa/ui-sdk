import { InvoicesStore } from '@monigo/portal-core';
import { RuneStore } from './base-rune.svelte';
export function createInvoicesRune(client) {
    return new RuneStore(new InvoicesStore(client));
}
