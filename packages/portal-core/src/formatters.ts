export function formatCurrency(
  amount: string | number,
  currency: string,
  locale: string = 'en-US',
  opts?: Intl.NumberFormatOptions,
): string {
  const numeric = typeof amount === 'string' ? parseFloat(amount) : amount
  if (Number.isNaN(numeric)) return ''
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...opts,
  }).format(numeric)
}

export function formatDate(
  value: string | Date | null | undefined,
  locale: string = 'en-US',
  opts: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
): string {
  if (value == null) return ''
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(locale, opts).format(date)
}

const INVOICE_STATUS: Record<string, string> = {
  draft: 'Draft',
  finalized: 'Awaiting Payment',
  paid: 'Paid',
  payment_failed: 'Payment Failed',
  voided: 'Voided',
  uncollectible: 'Uncollectible',
}

export function formatInvoiceStatus(status: string): string {
  return INVOICE_STATUS[status] ?? capitalise(status)
}

const SUBSCRIPTION_STATUS: Record<string, string> = {
  active: 'Active',
  trial: 'Trial',
  past_due: 'Past Due',
  canceled: 'Canceled',
  suspended: 'Suspended',
  ended: 'Ended',
}

export function formatSubscriptionStatus(status: string): string {
  return SUBSCRIPTION_STATUS[status] ?? capitalise(status)
}

const BILL_STATUS: Record<string, string> = {
  draft: 'Draft',
  finalized: 'Pending Payout',
  paid: 'Paid Out',
  payout_failed: 'Payout Failed',
  voided: 'Voided',
}

export function formatBillStatus(status: string): string {
  return BILL_STATUS[status] ?? capitalise(status)
}

function capitalise(value: string): string {
  return value
    .split(/[_\s]+/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')
}
