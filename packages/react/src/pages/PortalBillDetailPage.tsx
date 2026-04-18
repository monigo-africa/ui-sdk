import React from 'react'
import { BillDetail } from '../components/BillDetail'

export interface PortalBillDetailPageProps {
  billId: string
  className?: string
}

export function PortalBillDetailPage({ billId, className = '' }: PortalBillDetailPageProps): React.ReactElement {
  return <BillDetail billId={billId} className={className} />
}
