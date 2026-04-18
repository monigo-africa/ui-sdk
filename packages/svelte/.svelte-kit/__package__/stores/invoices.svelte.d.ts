import { type InvoicesState, type InvoicesAction, type PortalClient } from '@monigo/portal-core';
import { RuneStore } from './base-rune.svelte';
export type InvoicesRune = RuneStore<InvoicesState, InvoicesAction>;
export declare function createInvoicesRune(client: PortalClient): InvoicesRune;
//# sourceMappingURL=invoices.svelte.d.ts.map