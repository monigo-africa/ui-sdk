import React, { useEffect, useState, useCallback } from 'react'
import { formatCurrency, formatDate, type PortalLedgerEntry } from '@monigo/portal-core'
import { useMonigoContext } from '../provider/context'
import { Skeleton } from './shared/Skeleton'
import { EmptyState } from './shared/EmptyState'
import { ErrorState } from './shared/ErrorState'

export interface WalletTransactionListProps {
  walletId: string
  page?: number
  limit?: number
  className?: string
}

type ListState =
  | { status: 'loading' }
  | { status: 'ready'; entries: PortalLedgerEntry[]; count: number }
  | { status: 'error'; error: Error }

const cellStyle: React.CSSProperties = {
  padding: 'var(--monigo-space-3)',
  textAlign: 'left',
  fontSize: 'var(--monigo-text-sm)',
  borderBottom: '1px solid var(--monigo-color-border)',
}
const thStyle: React.CSSProperties = { ...cellStyle, color: 'var(--monigo-color-muted-fg)', fontWeight: 500 }

export function WalletTransactionList({ walletId, page = 1, limit = 20, className = '' }: WalletTransactionListProps): React.ReactElement {
  const { client, locale, messages } = useMonigoContext()
  const [state, setState] = useState<ListState>({ status: 'loading' })

  const load = useCallback(async () => {
    setState({ status: 'loading' })
    try {
      const res = await client.getWalletTransactions(walletId, page, limit)
      setState({ status: 'ready', entries: res.entries, count: res.count })
    } catch (err) {
      setState({ status: 'error', error: err instanceof Error ? err : new Error(String(err)) })
    }
  }, [client, walletId, page, limit])

  useEffect(() => { load() }, [load])

  if (state.status === 'loading') return <Skeleton rows={5} />
  if (state.status === 'error') {
    return <ErrorState error={state.error} onRetry={load} retryLabel={messages['common.retry']} />
  }
  if (state.entries.length === 0) return <EmptyState message="No transactions yet." />

  return (
    <div className={`monigo-wallet-tx-list ${className}`}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Amount</th>
            <th style={thStyle}>Balance</th>
          </tr>
        </thead>
        <tbody>
          {state.entries.map((entry) => (
            <tr key={entry.id}>
              <td style={cellStyle}>{formatDate(entry.created_at, locale)}</td>
              <td style={cellStyle}>{entry.description ?? entry.entry_type}</td>
              <td style={{ ...cellStyle, color: entry.direction === 'credit' ? 'var(--monigo-color-success)' : 'var(--monigo-color-danger)' }}>
                {entry.direction === 'credit' ? '+' : '-'}{formatCurrency(entry.amount, entry.currency, locale)}
              </td>
              <td style={cellStyle}>{formatCurrency(entry.balance_after, entry.currency, locale)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
