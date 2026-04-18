import type { Store } from '@monigo/portal-core';
export declare class RuneStore<S, A> {
    private readonly store;
    private _state;
    private unsubscribe;
    constructor(store: Store<S, A>);
    get state(): S;
    dispatch(action: A): Promise<void>;
    dispose(): void;
}
//# sourceMappingURL=base-rune.svelte.d.ts.map