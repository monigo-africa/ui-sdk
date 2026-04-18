import React from 'react'
import { WalletDetail } from '../components/WalletDetail'
import { WalletTransactionList } from '../components/WalletTransactionList'

export interface PortalWalletDetailPageProps {
  walletId: string
  className?: string
}

export function PortalWalletDetailPage({ walletId, className = '' }: PortalWalletDetailPageProps): React.ReactElement {
  return (
    <section className={`monigo-page ${className}`}>
      <WalletDetail walletId={walletId} />
      <WalletTransactionList walletId={walletId} />
    </section>
  )
}
