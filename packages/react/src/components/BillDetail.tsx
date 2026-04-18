import React, { useEffect, useState, useCallback } from 'react'
import { formatCurrency, formatDate, type Bill, type PayoutTransaction } from '@monigo/portal-core'
import { useMonigoContext } from '../provider/context'
import { BillStatusBadge } from './BillStatusBadge'
import { Skeleton } from './shared/Skeleton'
import { ErrorState } from './shared/ErrorState'

export interface BillDetailProps {
  billId: string
  className?: string
}

type DetailState =
  | { status: 'loading' }
  | { status: 'ready'; bill: Bill; transactions: PayoutTransaction[] }
  | { status: 'error'; error: Error }

export function BillDetail({ billId, className = '' }: BillDetailProps): React.ReactElement {
  const { client, locale, messages } = useMonigoContext()
  const [state, setState] = useState<DetailState>({ status: 'loading' })

  const load = useCallback(async () => {
    setState({ status: 'loading' })
    try {
      const [{ bill }, txRes] = await Promise.all([
        client.getBill(billId),
        client.getBillTransactions(billId).catch(() => ({ transactions: [] as PayoutTransaction[] })),
      ])
      setState({ status: 'ready', bill, transactions: txRes.transactions })
    } catch (err) {
      setState({ status: 'error', error: err instanceof Error ? err : new Error(String(err)) })
    }
  }, [client, billId])

  useEffect(() => { load() }, [load])

  if (state.status === 'loading') return <Skeleton rows={6} />
  if (state.status === 'error') {
    return <ErrorState error={state.error} onRetry={load} retryLabel={messages['common.retry']} />
  }

  const { bill, transactions } = state

  return (
    <article className={`monigo-bill-detail ${className}`}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: 'var(--monigo-space-6) 0', borderBottom: '1px solid var(--monigo-color-border)' }}>
        <div>
          <h2 style={{ margin: '0 0 var(--monigo-space-1)', fontSize: 'var(--monigo-text-xl)' }}>{bill.number}</h2>
          <p style={{ color: 'var(--monigo-color-muted-fg)', fontSize: 'var(--monigo-text-sm)', margin: 0 }}>{formatDate(bill.issued_at, locale)}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 'var(--monigo-text-2xl)', fontWeight: 600, marginBottom: 'var(--monigo-space-2)' }}>{formatCurrency(bill.total, bill.currency, locale)}</p>
          <BillStatusBadge status={bill.status} />
        </div>
      </header>

      {transactions.length > 0 && (
        <section style={{ padding: 'var(--monigo-space-5) 0' }}>
          <h3 style={{ margin: '0 0 var(--monigo-space-3)', fontSize: 'var(--monigo-text-md)' }}>Payout history</h3>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {transactions.map((t) => (
              <li key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--monigo-space-2) 0', borderBottom: '1px solid var(--monigo-color-border)', fontSize: 'var(--monigo-text-sm)' }}>
                <span>{formatDate(t.created_at, locale)}</span>
                <span>{formatCurrency(t.amount, t.currency, locale)}</span>
                <span>{t.status}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
