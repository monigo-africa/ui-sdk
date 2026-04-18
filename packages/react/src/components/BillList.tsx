import React, { useEffect } from 'react'
import { formatCurrency, formatDate, type Bill } from '@monigo/portal-core'
import { useMonigoContext } from '../provider/context'
import { useBills } from '../hooks/useBills'
import { BillStatusBadge } from './BillStatusBadge'
import { Skeleton } from './shared/Skeleton'
import { EmptyState } from './shared/EmptyState'
import { ErrorState } from './shared/ErrorState'

export interface BillListProps {
  limit?: number
  page?: number
  onBillClick?: (bill: Bill) => void
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

export function BillList({ limit = 20, page = 1, onBillClick, className = '' }: BillListProps): React.ReactElement {
  const { client, messages, locale } = useMonigoContext()
  const { state, dispatch } = useBills(client)

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
  if (state.bills.length === 0) {
    return <EmptyState message={messages['bills.empty']} />
  }

  return (
    <div className={`monigo-bill-list ${className}`}>
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
          {state.bills.map((bill) => (
            <tr
              key={bill.id}
              style={{ cursor: onBillClick ? 'pointer' : 'default' }}
              onClick={() => onBillClick?.(bill)}
              onKeyDown={(e) => e.key === 'Enter' && onBillClick?.(bill)}
              tabIndex={onBillClick ? 0 : -1}
              role={onBillClick ? 'button' : undefined}
            >
              <td style={cellStyle}>{bill.number}</td>
              <td style={cellStyle}>{formatDate(bill.issued_at, locale)}</td>
              <td style={cellStyle}>{formatCurrency(bill.total, bill.currency, locale)}</td>
              <td style={cellStyle}><BillStatusBadge status={bill.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
