import React, { useEffect, useState, useCallback } from 'react'
import { formatCurrency, formatDate, type PortalInvoice, type PaymentTransaction } from '@monigo/portal-core'
import { useMonigoContext } from '../provider/context'
import { InvoiceStatusBadge } from './InvoiceStatusBadge'
import { PayInvoiceButton } from './PayInvoiceButton'
import { Skeleton } from './shared/Skeleton'
import { ErrorState } from './shared/ErrorState'

export interface InvoiceDetailProps {
  invoiceId: string
  className?: string
}

type DetailState =
  | { status: 'loading' }
  | { status: 'ready'; invoice: PortalInvoice; transactions: PaymentTransaction[] }
  | { status: 'error'; error: Error }

export function InvoiceDetail({ invoiceId, className = '' }: InvoiceDetailProps): React.ReactElement {
  const { client, locale, messages } = useMonigoContext()
  const [state, setState] = useState<DetailState>({ status: 'loading' })

  const load = useCallback(async () => {
    setState({ status: 'loading' })
    try {
      const [{ invoice }, txRes] = await Promise.all([
        client.getInvoice(invoiceId),
        client.getInvoiceTransactions(invoiceId).catch(() => ({ transactions: [] as PaymentTransaction[] })),
      ])
      setState({ status: 'ready', invoice, transactions: txRes.transactions })
    } catch (err) {
      setState({ status: 'error', error: err instanceof Error ? err : new Error(String(err)) })
    }
  }, [client, invoiceId])

  useEffect(() => { load() }, [load])

  if (state.status === 'loading') return <Skeleton rows={6} />
  if (state.status === 'error') {
    return <ErrorState error={state.error} onRetry={load} retryLabel={messages['common.retry']} />
  }

  const { invoice, transactions } = state
  const lineItems = invoice.line_items as Array<{ description?: string; name?: string; amount?: string; total?: string }> | undefined

  return (
    <article className={`monigo-invoice-detail ${className}`}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: 'var(--monigo-space-6) 0', borderBottom: '1px solid var(--monigo-color-border)' }}>
        <div>
          <h2 style={{ margin: '0 0 var(--monigo-space-1)', fontSize: 'var(--monigo-text-xl)' }}>{invoice.id}</h2>
          <p style={{ color: 'var(--monigo-color-muted-fg)', fontSize: 'var(--monigo-text-sm)', margin: 0 }}>{formatDate(invoice.created_at, locale)}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 'var(--monigo-text-2xl)', fontWeight: 600, marginBottom: 'var(--monigo-space-2)' }}>{formatCurrency(invoice.total, invoice.currency, locale)}</p>
          <InvoiceStatusBadge status={invoice.status} />
        </div>
      </header>

      {(invoice.status === 'finalized' || (invoice.status as string) === 'payment_failed') && (
        <div style={{ padding: 'var(--monigo-space-4) 0' }}>
          <PayInvoiceButton invoiceId={invoice.id} />
        </div>
      )}

      {lineItems && lineItems.length > 0 && (
        <section style={{ padding: 'var(--monigo-space-5) 0' }}>
          <h3 style={{ margin: '0 0 var(--monigo-space-3)', fontSize: 'var(--monigo-text-md)' }}>Line items</h3>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {lineItems.map((line, i) => (
              <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--monigo-space-2) 0', borderBottom: '1px solid var(--monigo-color-border)', fontSize: 'var(--monigo-text-sm)' }}>
                <span>{line.description ?? line.name ?? 'Item'}</span>
                <span>{formatCurrency(line.amount ?? line.total ?? '0', invoice.currency, locale)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {transactions.length > 0 && (
        <section style={{ padding: 'var(--monigo-space-5) 0' }}>
          <h3 style={{ margin: '0 0 var(--monigo-space-3)', fontSize: 'var(--monigo-text-md)' }}>Payment history</h3>
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
