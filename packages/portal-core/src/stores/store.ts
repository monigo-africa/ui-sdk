export type Listener<S> = (state: S) => void
export type Unsubscribe = () => void

export interface Store<S, A> {
  getState(): S
  subscribe(listener: Listener<S>): Unsubscribe
  dispatch(action: A): Promise<void>
}

export abstract class BaseStore<S, A> implements Store<S, A> {
  private state: S
  private listeners = new Set<Listener<S>>()

  constructor(initial: S) {
    this.state = initial
  }

  getState(): S {
    return this.state
  }

  subscribe(listener: Listener<S>): Unsubscribe {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  async dispatch(action: A): Promise<void> {
    const next = await this.reduce(this.state, action)
    this.setState(next)
  }

  /**
   * Synchronously set a new state and notify subscribers. Subclasses use this
   * to emit intermediate states (e.g. `loading`) from within `reduce` before
   * returning the final state.
   */
  protected setState(next: S): void {
    if (next === this.state) return
    this.state = next
    for (const listener of this.listeners) {
      listener(next)
    }
  }

  protected abstract reduce(state: S, action: A): Promise<S>
}
