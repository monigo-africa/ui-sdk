import { WalletsStore } from '@monigo/portal-core';
import { RuneStore } from './base-rune.svelte';
export function createWalletsRune(client) {
    return new RuneStore(new WalletsStore(client));
}
