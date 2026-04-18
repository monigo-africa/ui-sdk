import { DashboardStore } from '@monigo/portal-core';
import { RuneStore } from './base-rune.svelte';
export function createDashboardRune(client) {
    return new RuneStore(new DashboardStore(client));
}
