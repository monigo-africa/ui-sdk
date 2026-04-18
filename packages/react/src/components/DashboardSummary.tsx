import React, { useEffect } from 'react'
import { formatCurrency } from '@monigo/portal-core'
import { useMonigoContext } from '../provider/context'
import { useDashboard } from '../hooks/useDashboard'
import { Skeleton } from './shared/Skeleton'
import { ErrorState } from './shared/ErrorState'

// NOTE: DashboardSummary and RecentActivity each call useDashboard(client),
// resulting in two store instances and two API round-trips when both are on
// the same page. Intentional for v1 simplicity — consolidate via context in
// a future iteration.

export interface DashboardSummaryProps {
  className?: string
}

export function DashboardSummary({ className = '' }: DashboardSummaryProps): React.ReactElement {
  const { client, messages, locale } = useMonigoContext()
  const { state, dispatch } = useDashboard(client)

  useEffect(() => { dispatch({ type: 'load' }) }, [dispatch])

  const snapshot = (state.status === 'ready' || state.status === 'loading' || state.status === 'error')
    ? ('snapshot' in state ? state.snapshot : undefined)
    : undefined

  if ((state.status === 'idle' || state.status === 'loading') && !snapshot) return <Skeleton rows={3} />
  if (state.status === 'error' && !snapshot) {
    return <ErrorState error={state.error} onRetry={() => dispatch({ type: 'refresh' })} retryLabel={messages['common.retry']} />
  }
  if (!snapshot) return <Skeleton rows={3} />

  const outstanding = snapshot.invoices
    .filter((i) => i.status === 'finalized')
    .reduce((sum, i) => sum + parseFloat(i.total), 0)
  const invoiceCurrency = snapshot.invoices[0]?.currency ?? 'NGN'

  const activeWallets = snapshot.wallets.filter((w) => w.status === 'active')
  const totalWalletBalance = activeWallets.reduce((sum, w) => sum + parseFloat(w.balance), 0)
  const walletCurrency = activeWallets[0]?.currency ?? 'NGN'

  const activeSubCount = snapshot.subscriptions.filter((s) => (s.status as string) !== 'canceled').length

  const cardStyle: React.CSSProperties = {
    padding: 'var(--monigo-space-4)',
    border: '1px solid var(--monigo-color-border)',
    borderRadius: 'var(--monigo-radius-md)',
    background: 'var(--monigo-color-muted)',
  }

  return (
    <div
      className={`monigo-dashboard-summary ${className}`}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--monigo-space-4)' }}
    >
      <div style={cardStyle}>
        <p style={{ fontSize: 'var(--monigo-text-xs)', color: 'var(--monigo-color-muted-fg)', margin: '0 0 var(--monigo-space-2)' }}>{messages['dashboard.outstanding']}</p>
        <p style={{ fontSize: 'var(--monigo-text-xl)', fontWeight: 700, color: 'var(--monigo-color-fg)', margin: '0 0 var(--monigo-space-1)' }}>{formatCurrency(outstanding, invoiceCurrency, locale)}</p>
        <p style={{ fontSize: 'var(--monigo-text-xs)', color: 'var(--monigo-color-muted-fg)', margin: 0 }}>Awaiting payment</p>
      </div>

      {activeWallets.length > 0 && (
        <div style={cardStyle}>
          <p style={{ fontSize: 'var(--monigo-text-xs)', color: 'var(--monigo-color-muted-fg)', margin: '0 0 var(--monigo-space-2)' }}>{messages['dashboard.wallet_balance']}</p>
          <p style={{ fontSize: 'var(--monigo-text-xl)', fontWeight: 700, color: 'var(--monigo-color-fg)', margin: '0 0 var(--monigo-space-1)' }}>{formatCurrency(totalWalletBalance, walletCurrency, locale)}</p>
          <p style={{ fontSize: 'var(--monigo-text-xs)', color: 'var(--monigo-color-muted-fg)', margin: 0 }}>Available</p>
        </div>
      )}

      <div style={cardStyle}>
        <p style={{ fontSize: 'var(--monigo-text-xs)', color: 'var(--monigo-color-muted-fg)', margin: '0 0 var(--monigo-space-2)' }}>Active subscriptions</p>
        <p style={{ fontSize: 'var(--monigo-text-xl)', fontWeight: 700, color: 'var(--monigo-color-primary)', margin: '0 0 var(--monigo-space-1)' }}>{activeSubCount}</p>
        <p style={{ fontSize: 'var(--monigo-text-xs)', color: 'var(--monigo-color-muted-fg)', margin: 0 }}>{activeSubCount === 1 ? 'plan' : 'plans'}</p>
      </div>
    </div>
  )
}
