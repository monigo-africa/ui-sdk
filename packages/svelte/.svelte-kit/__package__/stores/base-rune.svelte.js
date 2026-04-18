export class RuneStore {
    store;
    _state = $state(undefined);
    unsubscribe;
    constructor(store) {
        this.store = store;
        this._state = store.getState();
        this.unsubscribe = store.subscribe((next) => {
            this._state = next;
        });
    }
    get state() {
        return this._state;
    }
    dispatch(action) {
        return this.store.dispatch(action);
    }
    dispose() {
        this.unsubscribe();
    }
}
