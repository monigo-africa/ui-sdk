import React from 'react'
import type { PortalInvoice, Bill } from '@monigo/portal-core'
import { DashboardSummary } from '../components/DashboardSummary'
import { RecentActivity } from '../components/RecentActivity'

export interface PortalDashboardPageProps {
  onInvoiceClick?: (i: PortalInvoice) => void
  onBillClick?: (b: Bill) => void
  className?: string
}

export function PortalDashboardPage({ onInvoiceClick, onBillClick, className = '' }: PortalDashboardPageProps): React.ReactElement {
  return (
    <section className={`monigo-page ${className}`}>
      <DashboardSummary />
      <RecentActivity onInvoiceClick={onInvoiceClick} onBillClick={onBillClick} />
    </section>
  )
}
