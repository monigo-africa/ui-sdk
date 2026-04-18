import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { BaseStore } from '@monigo/portal-core'
import { useStore } from './useStore'

interface S { n: number }
type A = { type: 'inc' } | { type: 'set'; value: number }

class TestStore extends BaseStore<S, A> {
  constructor() { super({ n: 0 }) }
  protected async reduce(_state: S, action: A): Promise<S> {
    return action.type === 'inc' ? { n: _state.n + 1 } : { n: action.value }
  }
}

describe('useStore', () => {
  it('returns the initial state', () => {
    const store = new TestStore()
    const { result } = renderHook(() => useStore(store))
    expect(result.current.state.n).toBe(0)
  })

  it('reflects state after dispatch', async () => {
    const store = new TestStore()
    const { result } = renderHook(() => useStore(store))
    await act(() => result.current.dispatch({ type: 'set', value: 42 }))
    expect(result.current.state.n).toBe(42)
  })

  it('dispatch reference is stable across renders', async () => {
    const store = new TestStore()
    const { result, rerender } = renderHook(() => useStore(store))
    const first = result.current.dispatch
    rerender()
    expect(result.current.dispatch).toBe(first)
  })
})
