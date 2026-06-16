// Client
export { PortalClient } from './client'
export type { PortalClientOptions } from './client'

// Errors
export { PortalApiError, PortalUnauthorizedError, isPortalApiError } from './errors'
export type { PortalApiErrorInit } from './errors'

// Types
export type {
  PortalCustomerInfo,
  PortalToken,
  PortalInvoice,
  PortalInvoicesListResponse,
  PaymentTransaction,
  Bill,
  PortalBillsListResponse,
  PayoutTransaction,
  PortalSubscription,
  PortalWallet,
  PortalVirtualAccount,
  PortalLedgerEntry,
  PortalWalletTransactionsResponse,
  CustomerPaymentMethod,
  CustomerPayoutAccount,
  Invoice,
  Subscription,
  PayoutAccount,
} from './types'

// Formatters
export {
  formatCurrency,
  formatDate,
  formatInvoiceStatus,
  formatSubscriptionStatus,
  formatBillStatus,
} from './formatters'

// Messages
export { createMessages, defaultLocale } from './messages'
export type { MessageCatalog, MessageKey } from './messages'

// Stores
export type { Store, Listener, Unsubscribe } from './stores/store'
export { BaseStore } from './stores/store'

export { InvoicesStore } from './stores/invoices'
export type { InvoicesState, InvoicesAction } from './stores/invoices'

export { BillsStore } from './stores/bills'
export type { BillsState, BillsAction } from './stores/bills'

export { SubscriptionsStore } from './stores/subscriptions'
export type { SubscriptionsState, SubscriptionsAction } from './stores/subscriptions'

export { WalletsStore } from './stores/wallets'
export type { WalletsState, WalletsAction } from './stores/wallets'

export { PaymentMethodsStore } from './stores/payment-methods'
export type { PaymentMethodsState, PaymentMethodsAction } from './stores/payment-methods'

export { PayoutAccountsStore } from './stores/payout-accounts'
export type { PayoutAccountsState, PayoutAccountsAction } from './stores/payout-accounts'

export { DashboardStore } from './stores/dashboard'
export type { DashboardState, DashboardAction, DashboardSnapshot } from './stores/dashboard'

// Wallet funding — inline checkout + live balance
export type { FundingSession, FundingProvider } from './types'
export { launchCheckout } from './checkout'
export type { CheckoutResult, LaunchOptions, CheckoutAdapter } from './checkout'
export { createBalancePoller } from './polling'
export type { BalancePoller, BalancePollerOptions } from './polling'
