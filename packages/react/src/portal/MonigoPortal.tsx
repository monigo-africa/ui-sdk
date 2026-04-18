import React, { useState, useEffect, useCallback, useRef } from 'react'
import { defineRoutes, matchRoute } from './router'
import { PortalDashboardPage } from '../pages/PortalDashboardPage'
import { PortalInvoicesPage } from '../pages/PortalInvoicesPage'
import { PortalInvoiceDetailPage } from '../pages/PortalInvoiceDetailPage'
import { PortalBillsPage } from '../pages/PortalBillsPage'
import { PortalBillDetailPage } from '../pages/PortalBillDetailPage'
import { PortalSubscriptionsPage } from '../pages/PortalSubscriptionsPage'
import { PortalWalletsPage } from '../pages/PortalWalletsPage'
import { PortalWalletDetailPage } from '../pages/PortalWalletDetailPage'
import { PortalPaymentMethodsPage } from '../pages/PortalPaymentMethodsPage'
import { PortalPayoutAccountsPage } from '../pages/PortalPayoutAccountsPage'
import { useMonigoContext } from '../provider/context'

export interface MonigoPortalProps {
  basePath?: string
  router?: 'path' | 'hash' | 'memory'
  initialPath?: string
  className?: string
}

const routes = defineRoutes([
  { path: '/', name: 'dashboard' },
  { path: '/invoices', name: 'invoices' },
  { path: '/invoices/:id', name: 'invoice-detail' },
  { path: '/bills', name: 'bills' },
  { path: '/bills/:id', name: 'bill-detail' },
  { path: '/subscriptions', name: 'subscriptions' },
  { path: '/wallets', name: 'wallets' },
  { path: '/wallets/:id', name: 'wallet-detail' },
  { path: '/payment-methods', name: 'payment-methods' },
  { path: '/payout-accounts', name: 'payout-accounts' },
])

export function MonigoPortal({
  basePath = '/',
  router: routerMode = 'path',
  initialPath = '/',
  className = '',
}: MonigoPortalProps): React.ReactElement {
  const { messages } = useMonigoContext()
  const initialPathRef = useRef(initialPath)

  const readPath = useCallback((): string => {
    if (typeof window === 'undefined') return initialPathRef.current
    if (routerMode === 'memory') return initialPathRef.current
    if (routerMode === 'hash') return window.location.hash.slice(1) || '/'
    const full = window.location.pathname
    return full.startsWith(basePath) ? full.slice(basePath.length) || '/' : '/'
  }, [basePath, routerMode])

  const [currentPath, setCurrentPath] = useState<string>(() => readPath())

  const navigate = useCallback(
    (path: string) => {
      if (routerMode === 'memory') { setCurrentPath(path); return }
      if (typeof window === 'undefined') return
      if (routerMode === 'hash') { window.location.hash = path; return }
      const full = basePath.replace(/\/$/, '') + path
      history.pushState({}, '', full)
      setCurrentPath(path)
    },
    [basePath, routerMode],
  )

  useEffect(() => {
    setCurrentPath(readPath())
    if (routerMode === 'path' || routerMode === 'hash') {
      const onPopState = () => setCurrentPath(readPath())
      window.addEventListener('popstate', onPopState)
      return () => window.removeEventListener('popstate', onPopState)
    }
  }, [readPath, routerMode])

  const match = matchRoute(routes, currentPath)

  const navBtnStyle: React.CSSProperties = {
    padding: 'var(--monigo-space-2) var(--monigo-space-3)',
    background: 'transparent',
    border: 'none',
    color: 'var(--monigo-color-muted-fg)',
    fontSize: 'var(--monigo-text-sm)',
    cursor: 'pointer',
    borderRadius: 'var(--monigo-radius-sm)',
  }

  const renderPage = (): React.ReactElement => {
    if (!match || match.name === 'dashboard') {
      return (
        <PortalDashboardPage
          onInvoiceClick={(i) => navigate('/invoices/' + i.id)}
          onBillClick={(b) => navigate('/bills/' + b.id)}
        />
      )
    }
    if (match.name === 'invoices') return <PortalInvoicesPage onInvoiceClick={(i) => navigate('/invoices/' + i.id)} />
    if (match.name === 'invoice-detail') return <PortalInvoiceDetailPage invoiceId={match.params.id!} />
    if (match.name === 'bills') return <PortalBillsPage onBillClick={(b) => navigate('/bills/' + b.id)} />
    if (match.name === 'bill-detail') return <PortalBillDetailPage billId={match.params.id!} />
    if (match.name === 'subscriptions') return <PortalSubscriptionsPage />
    if (match.name === 'wallets') return <PortalWalletsPage onWalletClick={(w) => navigate('/wallets/' + w.id)} />
    if (match.name === 'wallet-detail') return <PortalWalletDetailPage walletId={match.params.id!} />
    if (match.name === 'payment-methods') return <PortalPaymentMethodsPage />
    if (match.name === 'payout-accounts') return <PortalPayoutAccountsPage />
    return <PortalDashboardPage />
  }

  return (
    <div className={`monigo-portal ${className}`}>
      <nav
        aria-label="Portal navigation"
        style={{ display: 'flex', gap: 'var(--monigo-space-2)', padding: 'var(--monigo-space-3) 0', borderBottom: '1px solid var(--monigo-color-border)', marginBottom: 'var(--monigo-space-5)' }}
      >
        <button type="button" style={navBtnStyle} onClick={() => navigate('/')}>{messages['nav.dashboard']}</button>
        <button type="button" style={navBtnStyle} onClick={() => navigate('/invoices')}>{messages['nav.invoices']}</button>
        <button type="button" style={navBtnStyle} onClick={() => navigate('/bills')}>{messages['nav.bills']}</button>
        <button type="button" style={navBtnStyle} onClick={() => navigate('/subscriptions')}>{messages['nav.subscriptions']}</button>
        <button type="button" style={navBtnStyle} onClick={() => navigate('/wallets')}>{messages['nav.wallets']}</button>
        <button type="button" style={navBtnStyle} onClick={() => navigate('/payment-methods')}>{messages['nav.payment_methods']}</button>
        <button type="button" style={navBtnStyle} onClick={() => navigate('/payout-accounts')}>{messages['nav.payout_accounts']}</button>
      </nav>
      {renderPage()}
    </div>
  )
}
