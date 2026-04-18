import React, { useEffect } from 'react'
import { type PortalWallet } from '@monigo/portal-core'
import { useMonigoContext } from '../provider/context'
import { useWallets } from '../hooks/useWallets'
import { WalletCard } from './WalletCard'
import { Skeleton } from './shared/Skeleton'
import { EmptyState } from './shared/EmptyState'
import { ErrorState } from './shared/ErrorState'

export interface WalletListProps {
  onWalletClick?: (wallet: PortalWallet) => void
  className?: string
}

export function WalletList({ onWalletClick, className = '' }: WalletListProps): React.ReactElement {
  const { client, messages } = useMonigoContext()
  const { state, dispatch } = useWallets(client)

  useEffect(() => { dispatch({ type: 'load' }) }, [dispatch])

  if (state.status === 'idle' || state.status === 'loading') return <Skeleton rows={3} />
  if (state.status === 'error') {
    return <ErrorState error={state.error} onRetry={() => dispatch({ type: 'refresh' })} retryLabel={messages['common.retry']} />
  }
  if (state.wallets.length === 0) return <EmptyState message={messages['wallets.empty']} />

  return (
    <div className={`monigo-wallet-list ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--monigo-space-3)' }}>
      {state.wallets.map((wallet) => (
        <WalletCard key={wallet.id} wallet={wallet} {...(onWalletClick !== undefined && { onClick: onWalletClick })} />
      ))}
    </div>
  )
}
