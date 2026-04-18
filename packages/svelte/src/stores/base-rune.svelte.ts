import type { Store, Unsubscribe } from '@monigo/portal-core'

export class RuneStore<S, A> {
  private _state: S = $state<S>(undefined as unknown as S)
  private unsubscribe: Unsubscribe

  constructor(private readonly store: Store<S, A>) {
    this._state = store.getState()
    this.unsubscribe = store.subscribe((next) => {
      this._state = next
    })
  }

  get state(): S {
    return this._state
  }

  dispatch(action: A): Promise<void> {
    return this.store.dispatch(action)
  }

  dispose(): void {
    this.unsubscribe()
  }
}
