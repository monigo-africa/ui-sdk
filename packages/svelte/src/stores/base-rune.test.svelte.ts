import { describe, it, expect } from 'vitest'
import { BaseStore } from '@monigo/portal-core'
import { RuneStore } from './base-rune.svelte'

interface S { n: number }
type A = { type: 'inc' } | { type: 'set'; value: number }

class TestStore extends BaseStore<S, A> {
  constructor() { super({ n: 0 }) }
  protected async reduce(state: S, action: A): Promise<S> {
    return action.type === 'inc' ? { n: state.n + 1 } : { n: action.value }
  }
}

describe('RuneStore', () => {
  it('exposes reactive state mirroring the underlying store', async () => {
    const store = new TestStore()
    const rune = new RuneStore(store)
    expect(rune.state.n).toBe(0)
    await rune.dispatch({ type: 'set', value: 7 })
    expect(rune.state.n).toBe(7)
  })

  it('disposes its subscription on .dispose()', async () => {
    const store = new TestStore()
    const rune = new RuneStore(store)
    rune.dispose()
    await store.dispatch({ type: 'inc' })
    expect(rune.state.n).toBe(0) // unchanged because the rune unsubscribed
  })
})
