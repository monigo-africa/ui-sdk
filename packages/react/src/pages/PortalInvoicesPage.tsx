import React from 'react'
import type { PortalInvoice } from '@monigo/portal-core'
import { useMonigoContext } from '../provider/context'
import { InvoiceList } from '../components/InvoiceList'

export interface PortalInvoicesPageProps {
  onInvoiceClick?: (i: PortalInvoice) => void
  className?: string
}

export function PortalInvoicesPage({ onInvoiceClick, className = '' }: PortalInvoicesPageProps): React.ReactElement {
  const { messages } = useMonigoContext()
  return (
    <section className={`monigo-page ${className}`}>
      <h1 style={{ fontSize: 'var(--monigo-text-2xl)', marginBottom: 'var(--monigo-space-5)' }}>{messages['invoices.title']}</h1>
      <InvoiceList {...(onInvoiceClick !== undefined && { onInvoiceClick })} />
    </section>
  )
}
