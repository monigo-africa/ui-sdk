import { type PayoutAccountsState, type PayoutAccountsAction, type PortalClient } from '@monigo/portal-core';
import { RuneStore } from './base-rune.svelte';
export type PayoutAccountsRune = RuneStore<PayoutAccountsState, PayoutAccountsAction>;
export declare function createPayoutAccountsRune(client: PortalClient): PayoutAccountsRune;
//# sourceMappingURL=payout-accounts.svelte.d.ts.map