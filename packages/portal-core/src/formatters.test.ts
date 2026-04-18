import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatDate,
  formatInvoiceStatus,
  formatSubscriptionStatus,
  formatBillStatus,
} from './formatters'

describe('formatCurrency', () => {
  it('formats NGN amounts with locale-aware separators', () => {
    expect(formatCurrency('1234.5', 'NGN', 'en-NG')).toMatch(/1,234/)
    expect(formatCurrency('1234.5', 'NGN', 'en-NG')).toMatch(/₦|NGN/)
  })
  it('formats USD amounts', () => {
    expect(formatCurrency('99.9', 'USD', 'en-US')).toContain('$')
  })
  it('accepts numeric input', () => {
    expect(formatCurrency(50, 'USD', 'en-US')).toMatch(/50/)
  })
})

describe('formatDate', () => {
  it('formats ISO strings in the given locale', () => {
    const out = formatDate('2026-04-18T12:00:00Z', 'en-US', { dateStyle: 'medium' })
    expect(out).toMatch(/Apr/)
    expect(out).toMatch(/2026/)
  })
  it('returns empty string on null input', () => {
    expect(formatDate(null, 'en-US')).toBe('')
  })
})

describe('formatInvoiceStatus', () => {
  it('maps finalized to "Awaiting Payment"', () => {
    expect(formatInvoiceStatus('finalized')).toBe('Awaiting Payment')
  })
  it('maps paid to "Paid"', () => {
    expect(formatInvoiceStatus('paid')).toBe('Paid')
  })
  it('maps payment_failed to "Payment Failed"', () => {
    expect(formatInvoiceStatus('payment_failed')).toBe('Payment Failed')
  })
  it('falls back to capitalised raw status for unknown values', () => {
    expect(formatInvoiceStatus('draft')).toBe('Draft')
  })
})

describe('formatSubscriptionStatus', () => {
  it('formats known subscription statuses', () => {
    expect(formatSubscriptionStatus('active')).toBe('Active')
    expect(formatSubscriptionStatus('trial')).toBe('Trial')
    expect(formatSubscriptionStatus('canceled')).toBe('Canceled')
    expect(formatSubscriptionStatus('past_due')).toBe('Past Due')
  })
})

describe('formatBillStatus', () => {
  it('maps finalized/payout_failed to user labels', () => {
    expect(formatBillStatus('finalized')).toBe('Pending Payout')
    expect(formatBillStatus('payout_failed')).toBe('Payout Failed')
    expect(formatBillStatus('paid')).toBe('Paid Out')
  })
})
