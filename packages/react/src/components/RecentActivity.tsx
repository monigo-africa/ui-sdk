import React, { useEffect } from 'react'
import { formatCurrency, formatDate, type PortalInvoice, type Bill } from '@monigo/portal-core'
import { useMonigoContext } from '../provider/context'
import { useDashboard } from '../hooks/useDashboard'
import { InvoiceStatusBadge } from './InvoiceStatusBadge'
import { BillStatusBadge } from './BillStatusBadge'
import { Skeleton } from './shared/Skeleton'
import { ErrorState } from './shared/ErrorState'

export interface RecentActivityProps {
  onInvoiceClick?: (invoice: PortalInvoice) => void
  onBillClick?: (bill: Bill) => void
  className?: string
}

export function RecentActivity({ onInvoiceClick, onBillClick, className = '' }: RecentActivityProps): React.ReactElement {
  const { client, messages, locale } = useMonigoContext()
  const { state, dispatch } = useDashboard(client)

  useEffect(() => { dispatch({ type: 'load' }) }, [dispatch])

  const snapshot = (state.status === 'ready' || state.status === 'loading' || state.status === 'error')
    ? ('snapshot' in state ? state.snapshot : undefined)
    : undefined

  if ((state.status === 'idle' || state.status === 'loading') && !snapshot) return <Skeleton rows={5} />
  if (state.status === 'error' && !snapshot) {
    return <ErrorState error={state.error} onRetry={() => dispatch({ type: 'refresh' })} retryLabel={messages['common.retry']} />
  }
  if (!snapshot) return <Skeleton rows={5} />

  const recentInvoices = snapshot.invoices.slice(0, 5)
  const recentBills = snapshot.bills.slice(0, 5)

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'var(--monigo-space-2) 0',
    borderBottom: '1px solid var(--monigo-color-border)',
    fontSize: 'var(--monigo-text-sm)',
    cursor: onInvoiceClick ? 'pointer' : 'default',
  }

  return (
    <div className={`monigo-recent-activity ${className}`}>
      {recentInvoices.length > 0 && (
        <section style={{ marginBottom: 'var(--monigo-space-5)' }}>
          <h3 style={{ fontSize: 'var(--monigo-text-md)', margin: '0 0 var(--monigo-space-3)' }}>{messages['dashboard.recent_invoices']}</h3>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {recentInvoices.map((inv) => (
              <li
                key={inv.id}
                style={rowStyle}
                onClick={() => onInvoiceClick?.(inv)}
                onKeyDown={(e) => e.key === 'Enter' && onInvoiceClick?.(inv)}
                tabIndex={onInvoiceClick ? 0 : -1}
                role={onInvoiceClick ? 'button' : undefined}
              >
                <span>{inv.id}</span>
                <span>{formatDate(inv.created_at, locale)}</span>
                <span>{formatCurrency(inv.total, inv.currency, locale)}</span>
                <InvoiceStatusBadge status={inv.status} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {recentBills.length > 0 && (
        <section>
          <h3 style={{ fontSize: 'var(--monigo-text-md)', margin: '0 0 var(--monigo-space-3)' }}>{messages['dashboard.recent_payouts']}</h3>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {recentBills.map((bill) => (
              <li
                key={bill.id}
                style={{ ...rowStyle, cursor: onBillClick ? 'pointer' : 'default' }}
                onClick={() => onBillClick?.(bill)}
                onKeyDown={(e) => e.key === 'Enter' && onBillClick?.(bill)}
                tabIndex={onBillClick ? 0 : -1}
                role={onBillClick ? 'button' : undefined}
              >
                <span>{bill.number}</span>
                <span>{formatDate(bill.issued_at, locale)}</span>
                <span>{formatCurrency(bill.total, bill.currency, locale)}</span>
                <BillStatusBadge status={bill.status} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
