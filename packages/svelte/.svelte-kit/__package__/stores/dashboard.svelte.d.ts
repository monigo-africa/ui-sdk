import { type DashboardState, type DashboardAction, type PortalClient } from '@monigo/portal-core';
import { RuneStore } from './base-rune.svelte';
export type DashboardRune = RuneStore<DashboardState, DashboardAction>;
export declare function createDashboardRune(client: PortalClient): DashboardRune;
//# sourceMappingURL=dashboard.svelte.d.ts.map