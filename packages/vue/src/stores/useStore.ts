import { ref, onUnmounted, readonly, type Ref } from 'vue'
import type { Store } from '@monigo/portal-core'

export interface UseStoreResult<S, A> {
  state: Readonly<Ref<S>>
  dispatch: (action: A) => Promise<void>
  dispose: () => void
}

export function useStore<S, A>(store: Store<S, A>): UseStoreResult<S, A> {
  const state = ref(store.getState()) as Ref<S>

  const unsubscribe = store.subscribe((next) => {
    state.value = next
  })

  onUnmounted(unsubscribe)

  return {
    state: readonly(state),
    dispatch: (action: A) => store.dispatch(action),
    dispose: unsubscribe,
  }
}
