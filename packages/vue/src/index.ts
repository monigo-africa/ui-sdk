// Provider
export { default as MonigoProvider } from './provider/MonigoProvider.vue'
export { MONIGO_CONTEXT_KEY, provideMonigoContext, useMonigoContext } from './provider/context'
export type { MonigoContext, MonigoTheme } from './provider/context'

// Composables
export { useStore } from './stores/useStore'
export type { UseStoreResult } from './stores/useStore'
export { useInvoices } from './stores/useInvoices'
export type { UseInvoicesResult } from './stores/useInvoices'
export { useBills } from './stores/useBills'
export type { UseBillsResult } from './stores/useBills'
export { useSubscriptions } from './stores/useSubscriptions'
export type { UseSubscriptionsResult } from './stores/useSubscriptions'
export { useWallets } from './stores/useWallets'
export type { UseWalletsResult } from './stores/useWallets'
export { usePaymentMethods } from './stores/usePaymentMethods'
export type { UsePaymentMethodsResult } from './stores/usePaymentMethods'
export { usePayoutAccounts } from './stores/usePayoutAccounts'
export type { UsePayoutAccountsResult } from './stores/usePayoutAccounts'
export { useDashboard } from './stores/useDashboard'
export type { UseDashboardResult } from './stores/useDashboard'

// Shared
export { default as Skeleton } from './components/shared/Skeleton.vue'
export { default as EmptyState } from './components/shared/EmptyState.vue'
export { default as ErrorState } from './components/shared/ErrorState.vue'

// Invoices
export { default as InvoiceList } from './components/InvoiceList.vue'
export { default as InvoiceDetail } from './components/InvoiceDetail.vue'
export { default as InvoiceStatusBadge } from './components/InvoiceStatusBadge.vue'
export { default as PayInvoiceButton } from './components/PayInvoiceButton.vue'

// Bills
export { default as BillList } from './components/BillList.vue'
export { default as BillDetail } from './components/BillDetail.vue'
export { default as BillStatusBadge } from './components/BillStatusBadge.vue'

// Subscriptions
export { default as SubscriptionList } from './components/SubscriptionList.vue'
export { default as SubscriptionCard } from './components/SubscriptionCard.vue'
export { default as CancelSubscriptionButton } from './components/CancelSubscriptionButton.vue'

// Wallets
export { default as WalletList } from './components/WalletList.vue'
export { default as WalletCard } from './components/WalletCard.vue'
export { default as WalletDetail } from './components/WalletDetail.vue'
export { default as WalletTransactionList } from './components/WalletTransactionList.vue'
export { default as FundWalletButton } from './components/FundWalletButton.vue'
export { default as WalletWidget } from './components/WalletWidget.vue'

// Payment methods
export { default as PaymentMethodList } from './components/PaymentMethodList.vue'
export { default as PaymentMethodCard } from './components/PaymentMethodCard.vue'
export { default as AddPaymentMethodButton } from './components/AddPaymentMethodButton.vue'
export { default as RemovePaymentMethodButton } from './components/RemovePaymentMethodButton.vue'
export { default as SetDefaultPaymentMethodButton } from './components/SetDefaultPaymentMethodButton.vue'

// Payout accounts
export { default as PayoutAccountList } from './components/PayoutAccountList.vue'
export { default as PayoutAccountCard } from './components/PayoutAccountCard.vue'

// Dashboard
export { default as DashboardSummary } from './components/DashboardSummary.vue'
export { default as RecentActivity } from './components/RecentActivity.vue'

// Pages
export { default as PortalDashboardPage } from './pages/PortalDashboardPage.vue'
export { default as PortalInvoicesPage } from './pages/PortalInvoicesPage.vue'
export { default as PortalInvoiceDetailPage } from './pages/PortalInvoiceDetailPage.vue'
export { default as PortalBillsPage } from './pages/PortalBillsPage.vue'
export { default as PortalBillDetailPage } from './pages/PortalBillDetailPage.vue'
export { default as PortalSubscriptionsPage } from './pages/PortalSubscriptionsPage.vue'
export { default as PortalWalletsPage } from './pages/PortalWalletsPage.vue'
export { default as PortalWalletDetailPage } from './pages/PortalWalletDetailPage.vue'
export { default as PortalPaymentMethodsPage } from './pages/PortalPaymentMethodsPage.vue'
export { default as PortalPayoutAccountsPage } from './pages/PortalPayoutAccountsPage.vue'

// Composed portal
export { default as MonigoPortal } from './portal/MonigoPortal.vue'

// Router utilities (for custom portal shells)
export { defineRoutes, matchRoute } from './portal/router'
export type { RouteDef, CompiledRoute, RouteMatch } from './portal/router'
