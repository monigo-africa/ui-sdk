// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { loadScript, _resetLoadedScripts } from './loadScript'

describe('loadScript', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    _resetLoadedScripts()
  })

  it('appends a script tag and resolves on load', async () => {
    const p = loadScript('https://example.com/a.js')
    const el = document.head.querySelector('script') as HTMLScriptElement
    expect(el.src).toBe('https://example.com/a.js')
    el.onload!(new Event('load'))
    await expect(p).resolves.toBeUndefined()
  })

  it('is idempotent — same src returns the same promise and one tag', () => {
    const p1 = loadScript('https://example.com/b.js')
    const p2 = loadScript('https://example.com/b.js')
    expect(p1).toBe(p2)
    expect(document.head.querySelectorAll('script').length).toBe(1)
  })

  it('rejects on error, evicts the cache, and removes the dead tag so a retry re-appends', async () => {
    const p1 = loadScript('https://example.com/c.js')
    const el1 = document.head.querySelector('script') as HTMLScriptElement
    el1.onerror!(new Event('error'))
    await expect(p1).rejects.toThrow(/Failed to load script/)
    // dead tag removed
    expect(document.head.querySelectorAll('script').length).toBe(0)
    // a fresh call after failure re-appends (cache was evicted) and is a new promise
    const p2 = loadScript('https://example.com/c.js')
    expect(p2).not.toBe(p1)
    expect(document.head.querySelectorAll('script').length).toBe(1)
    // settle p2 so there is no unhandled rejection
    ;(document.head.querySelector('script') as HTMLScriptElement).onload!(new Event('load'))
    await expect(p2).resolves.toBeUndefined()
  })
})
