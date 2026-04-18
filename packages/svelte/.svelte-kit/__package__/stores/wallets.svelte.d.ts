import { type WalletsState, type WalletsAction, type PortalClient } from '@monigo/portal-core';
import { RuneStore } from './base-rune.svelte';
export type WalletsRune = RuneStore<WalletsState, WalletsAction>;
export declare function createWalletsRune(client: PortalClient): WalletsRune;
//# sourceMappingURL=wallets.svelte.d.ts.map