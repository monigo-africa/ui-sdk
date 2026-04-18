export const en = {
  // Generic
  'common.loading': 'Loading…',
  'common.retry': 'Try again',
  'common.cancel': 'Cancel',
  'common.confirm': 'Confirm',
  'common.close': 'Close',
  'common.error.generic': 'Something went wrong. Please try again.',

  // Navigation
  'nav.dashboard': 'Dashboard',
  'nav.invoices': 'Invoices',
  'nav.bills': 'Payouts',
  'nav.subscriptions': 'Subscriptions',
  'nav.wallets': 'Wallets',
  'nav.payment_methods': 'Payment Methods',
  'nav.payout_accounts': 'Payout Accounts',

  // Invoices
  'invoices.title': 'Invoices',
  'invoices.empty': 'You have no invoices yet.',
  'invoices.column.number': 'Invoice #',
  'invoices.column.date': 'Date',
  'invoices.column.amount': 'Amount',
  'invoices.column.status': 'Status',
  'invoices.action.pay': 'Pay now',
  'invoices.action.download': 'Download PDF',
  'invoices.pay.error': 'We could not start the payment. Please try again.',

  // Bills (payouts)
  'bills.title': 'Payouts',
  'bills.empty': 'You have no payouts yet.',

  // Subscriptions
  'subscriptions.title': 'Subscriptions',
  'subscriptions.empty': 'You have no active subscriptions.',
  'subscriptions.action.cancel': 'Cancel subscription',
  'subscriptions.cancel.confirm': 'Are you sure you want to cancel this subscription?',

  // Wallets
  'wallets.title': 'Wallets',
  'wallets.empty': 'You have no wallets yet.',
  'wallets.action.fund': 'Top up',

  // Payment methods
  'payment_methods.title': 'Payment Methods',
  'payment_methods.empty': 'No payment methods on file.',
  'payment_methods.action.add': 'Add payment method',
  'payment_methods.action.remove': 'Remove',
  'payment_methods.action.default': 'Make default',

  // Payout accounts
  'payout_accounts.title': 'Payout Accounts',
  'payout_accounts.empty': 'No payout accounts on file.',

  // Dashboard
  'dashboard.outstanding': 'Outstanding',
  'dashboard.wallet_balance': 'Wallet balance',
  'dashboard.recent_invoices': 'Recent invoices',
  'dashboard.recent_payouts': 'Recent payouts',
}

export type MessageKey = keyof typeof en
export type MessageCatalog = Record<MessageKey, string>
