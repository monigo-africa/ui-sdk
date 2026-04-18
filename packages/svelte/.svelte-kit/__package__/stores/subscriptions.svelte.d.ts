import { type SubscriptionsState, type SubscriptionsAction, type PortalClient } from '@monigo/portal-core';
import { RuneStore } from './base-rune.svelte';
export type SubscriptionsRune = RuneStore<SubscriptionsState, SubscriptionsAction>;
export declare function createSubscriptionsRune(client: PortalClient): SubscriptionsRune;
//# sourceMappingURL=subscriptions.svelte.d.ts.map