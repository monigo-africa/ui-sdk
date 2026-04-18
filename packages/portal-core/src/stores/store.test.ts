import { describe, it, expect, vi } from 'vitest'
import { BaseStore } from './store'

interface S {
  n: number
}
type A = { type: 'inc' } | { type: 'set'; value: number }

class TestStore extends BaseStore<S, A> {
  constructor() {
    super({ n: 0 })
  }
  protected async reduce(state: S, action: A): Promise<S> {
    switch (action.type) {
      case 'inc':
        return { n: state.n + 1 }
      case 'set':
        return { n: action.value }
    }
  }
}

describe('BaseStore', () => {
  it('starts with the initial state', () => {
    const s = new TestStore()
    expect(s.getState()).toEqual({ n: 0 })
  })

  it('dispatches actions and updates state', async () => {
    const s = new TestStore()
    await s.dispatch({ type: 'inc' })
    expect(s.getState()).toEqual({ n: 1 })
  })

  it('notifies subscribers on state change', async () => {
    const s = new TestStore()
    const listener = vi.fn()
    const unsubscribe = s.subscribe(listener)
    await s.dispatch({ type: 'set', value: 5 })
    expect(listener).toHaveBeenCalledWith({ n: 5 })
    unsubscribe()
    await s.dispatch({ type: 'inc' })
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('does not notify when state is referentially equal', async () => {
    class Id extends BaseStore<S, A> {
      constructor() { super({ n: 0 }) }
      protected async reduce(state: S): Promise<S> { return state }
    }
    const s = new Id()
    const listener = vi.fn()
    s.subscribe(listener)
    await s.dispatch({ type: 'inc' })
    expect(listener).not.toHaveBeenCalled()
  })
})
