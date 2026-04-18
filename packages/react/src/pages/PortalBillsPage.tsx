import React from 'react'
import type { Bill } from '@monigo/portal-core'
import { useMonigoContext } from '../provider/context'
import { BillList } from '../components/BillList'

export interface PortalBillsPageProps {
  onBillClick?: (b: Bill) => void
  className?: string
}

export function PortalBillsPage({ onBillClick, className = '' }: PortalBillsPageProps): React.ReactElement {
  const { messages } = useMonigoContext()
  return (
    <section className={`monigo-page ${className}`}>
      <h1 style={{ fontSize: 'var(--monigo-text-2xl)', marginBottom: 'var(--monigo-space-5)' }}>{messages['bills.title']}</h1>
      <BillList {...(onBillClick !== undefined && { onBillClick })} />
    </section>
  )
}
