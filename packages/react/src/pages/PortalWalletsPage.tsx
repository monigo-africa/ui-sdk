import React from 'react'
import type { PortalWallet } from '@monigo/portal-core'
import { useMonigoContext } from '../provider/context'
import { WalletList } from '../components/WalletList'

export interface PortalWalletsPageProps {
  onWalletClick?: (w: PortalWallet) => void
  className?: string
}

export function PortalWalletsPage({ onWalletClick, className = '' }: PortalWalletsPageProps): React.ReactElement {
  const { messages } = useMonigoContext()
  return (
    <section className={`monigo-page ${className}`}>
      <h1 style={{ fontSize: 'var(--monigo-text-2xl)', marginBottom: 'var(--monigo-space-5)' }}>{messages['wallets.title']}</h1>
      <WalletList {...(onWalletClick !== undefined && { onWalletClick })} />
    </section>
  )
}
