import { describe, it, expect } from 'vitest'
import { createTheme } from './create-theme'

describe('createTheme', () => {
  it('returns a CSS string that sets primary and accent on the given selector', () => {
    const css = createTheme({ primary: '#6366f1', accent: '#f43f5e' })
    expect(css).toContain('--monigo-color-primary: #6366f1')
    expect(css).toContain('--monigo-color-accent: #f43f5e')
    expect(css.trim().startsWith(':root')).toBe(true)
  })

  it('scopes to the given selector when provided', () => {
    const css = createTheme({ primary: '#000', accent: '#fff', selector: '.billing' })
    expect(css.trim().startsWith('.billing')).toBe(true)
  })

  it('appends dark overrides when mode is "dark"', () => {
    const css = createTheme({ primary: '#000', accent: '#fff', mode: 'dark' })
    expect(css).toContain("[data-monigo-theme='dark']")
  })

  it('omits dark overrides for mode "light"', () => {
    const css = createTheme({ primary: '#000', accent: '#fff', mode: 'light' })
    expect(css).not.toContain("[data-monigo-theme='dark']")
  })

  it('supports optional radius and font overrides', () => {
    const css = createTheme({
      primary: '#000',
      accent: '#fff',
      radius: 'lg',
      font: 'Inter, sans-serif',
    })
    expect(css).toContain('--monigo-radius-md: 12px')
    expect(css).toContain("--monigo-font-sans: Inter, sans-serif")
  })

  it('throws on invalid hex colour', () => {
    expect(() => createTheme({ primary: 'red', accent: '#fff' })).toThrow()
  })
})
