import { getContext, setContext } from 'svelte';
export const MONIGO_CONTEXT_KEY = Symbol('monigo.context');
export function createMonigoContext(init) {
    return init;
}
export function setMonigoContext(ctx) {
    setContext(MONIGO_CONTEXT_KEY, ctx);
}
export function getMonigoContext() {
    const ctx = getContext(MONIGO_CONTEXT_KEY);
    if (!ctx) {
        throw new Error('@monigo/svelte: no MonigoProvider ancestor found. Wrap your app in <MonigoProvider portalToken="..." />.');
    }
    return ctx;
}
