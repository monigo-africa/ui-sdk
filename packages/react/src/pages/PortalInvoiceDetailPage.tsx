import React from 'react'
import { InvoiceDetail } from '../components/InvoiceDetail'

export interface PortalInvoiceDetailPageProps {
  invoiceId: string
  className?: string
}

export function PortalInvoiceDetailPage({ invoiceId, className = '' }: PortalInvoiceDetailPageProps): React.ReactElement {
  return <InvoiceDetail invoiceId={invoiceId} className={className} />
}
