const loaded = new Map<string, Promise<void>>()

/** Idempotently load an external script. Resolves once the script's load event
 *  fires; rejects (and forgets the cache entry) on error or outside a browser. */
export function loadScript(src: string): Promise<void> {
  if (typeof document === 'undefined') {
    return Promise.reject(new Error('loadScript requires a browser environment'))
  }
  const existing = loaded.get(src)
  if (existing) return existing

  const p = new Promise<void>((resolve, reject) => {
    const el = document.createElement('script')
    el.src = src
    el.async = true
    el.onload = () => resolve()
    el.onerror = () => {
      loaded.delete(src) // allow a later retry to re-append
      el.remove()        // don't leave a dead <script> in the DOM
      reject(new Error(`Failed to load script: ${src}`))
    }
    document.head.appendChild(el)
  })
  loaded.set(src, p)
  return p
}

/** Test-only: clear the in-memory cache between tests. */
export function _resetLoadedScripts(): void {
  loaded.clear()
}
