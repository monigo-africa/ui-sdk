import { type BillsState, type BillsAction, type PortalClient } from '@monigo/portal-core';
import { RuneStore } from './base-rune.svelte';
export type BillsRune = RuneStore<BillsState, BillsAction>;
export declare function createBillsRune(client: PortalClient): BillsRune;
//# sourceMappingURL=bills.svelte.d.ts.map