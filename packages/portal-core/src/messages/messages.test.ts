import { describe, it, expect } from 'vitest'
import { createMessages, defaultLocale } from './index'

describe('createMessages', () => {
  it('returns the English catalog by default', () => {
    const m = createMessages()
    expect(m['invoices.title']).toBe('Invoices')
    expect(m['invoices.empty']).toBe('You have no invoices yet.')
  })

  it('applies partial overrides on top of the locale baseline', () => {
    const m = createMessages(defaultLocale, { 'invoices.title': 'My Bills' })
    expect(m['invoices.title']).toBe('My Bills')
    expect(m['invoices.empty']).toBe('You have no invoices yet.') // unchanged
  })

  it('falls back to English for unknown locales', () => {
    const m = createMessages('zz-ZZ')
    expect(m['invoices.title']).toBe('Invoices')
  })
})
