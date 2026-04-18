import React, { useEffect } from 'react'
import { formatCurrency, formatDate, type PortalInvoice } from '@monigo/portal-core'
import { useMonigoContext } from '../provider/context'
import { useInvoices } from '../hooks/useInvoices'
import { InvoiceStatusBadge } from './InvoiceStatusBadge'
import { Skeleton } from './shared/Skeleton'
import { EmptyState } from './shared/EmptyState'
import { ErrorState } from './shared/ErrorState'

export interface InvoiceListProps {
  limit?: number
  page?: number
  onInvoiceClick?: (invoice: PortalInvoice) => void
  className?: string
}

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' }
const cellStyle: React.CSSProperties = {
  padding: 'var(--monigo-space-3)',
  textAlign: 'left',
  fontSize: 'var(--monigo-text-sm)',
  borderBottom: '1px solid var(--monigo-color-border)',
}
const thStyle: React.CSSProperties = { ...cellStyle, color: 'var(--monigo-color-muted-fg)', fontWeight: 500 }

export function InvoiceList({ limit = 20, page = 1, onInvoiceClick, className = '' }: InvoiceListProps): React.ReactElement {
  const { client, messages, locale } = useMonigoContext()
  const { state, dispatch } = useInvoices(client)

  useEffect(() => {
    dispatch({ type: 'load', page, limit })
  }, [dispatch, page, limit])

  if (state.status === 'idle' || state.status === 'loading') {
    return <Skeleton rows={5} />
  }
  if (state.status === 'error') {
    return (
      <ErrorState
        error={state.error}
        onRetry={() => dispatch({ type: 'refresh' })}
        retryLabel={messages['common.retry']}
      />
    )
  }
  if (state.invoices.length === 0) {
    return <EmptyState message={messages['invoices.empty']} />
  }

  return (
    <div className={`monigo-invoice-list ${className}`}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>{messages['invoices.column.number']}</th>
            <th style={thStyle}>{messages['invoices.column.date']}</th>
            <th style={thStyle}>{messages['invoices.column.amount']}</th>
            <th style={thStyle}>{messages['invoices.column.status']}</th>
          </tr>
        </thead>
        <tbody>
          {state.invoices.map((invoice) => (
            <tr
              key={invoice.id}
              style={{ cursor: onInvoiceClick ? 'pointer' : 'default' }}
              onClick={() => onInvoiceClick?.(invoice)}
              onKeyDown={(e) => e.key === 'Enter' && onInvoiceClick?.(invoice)}
              tabIndex={onInvoiceClick ? 0 : -1}
              role={onInvoiceClick ? 'button' : undefined}
            >
              <td style={cellStyle}>{invoice.id}</td>
              <td style={cellStyle}>{formatDate(invoice.created_at, locale)}</td>
              <td style={cellStyle}>{formatCurrency(invoice.total, invoice.currency, locale)}</td>
              <td style={cellStyle}><InvoiceStatusBadge status={invoice.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
