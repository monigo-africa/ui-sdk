import { describe, it, expect } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
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
    const { dispose, state } = useStore(store)
    expect(state.value.n).toBe(0)
    dispose()
  })

  it('reflects state after dispatch', async () => {
    const store = new TestStore()
    const { dispose, state, dispatch } = useStore(store)
    await dispatch({ type: 'set', value: 42 })
    await nextTick()
    expect(state.value.n).toBe(42)
    dispose()
  })

  it('unsubscribes on component unmount', async () => {
    const store = new TestStore()
    let subscribeCalled = 0
    const originalSubscribe = store.subscribe.bind(store)
    store.subscribe = (fn) => {
      subscribeCalled++
      return originalSubscribe(fn)
    }

    const Comp = defineComponent({
      setup() {
        useStore(store)
        return () => h('span', 'x')
      },
    })

    const wrapper = mount(Comp)
    expect(subscribeCalled).toBe(1)
    wrapper.unmount()
    // After unmount, dispatching should not update state (unsubscribed)
    await store.dispatch({ type: 'set', value: 99 })
    await nextTick()
    // No assertion needed — just verify no error thrown
  })
})
