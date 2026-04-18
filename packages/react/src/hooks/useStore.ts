import { useCallback, useSyncExternalStore } from 'react'
import type { Store } from '@monigo/portal-core'

export interface UseStoreResult<S, A> {
  state: S
  dispatch: (action: A) => Promise<void>
}

export function useStore<S, A>(store: Store<S, A>): UseStoreResult<S, A> {
  const state = useSyncExternalStore(
    store.subscribe.bind(store),
    store.getState.bind(store),
    store.getState.bind(store), // server snapshot — same as client for portals
  )

  const dispatch = useCallback(
    (action: A) => store.dispatch(action),
    // store identity is stable for the lifetime of the hook
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store],
  )

  return { state, dispatch }
}
