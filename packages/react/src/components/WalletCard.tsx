import React from 'react'
import { formatCurrency, type PortalWallet } from '@monigo/portal-core'
import { useMonigoContext } from '../provider/context'

export interface WalletCardProps {
  wallet: PortalWallet
  className?: string
  onClick?: (wallet: PortalWallet) => void
}

export function WalletCard({ wallet, className = '', onClick }: WalletCardProps): React.ReactElement {
  const { locale } = useMonigoContext()
  const statusColor = wallet.status === 'active' ? 'var(--monigo-color-success)' : 'var(--monigo-color-muted-fg)'

  return (
    <div
      className={`monigo-wallet-card ${className}`}
      style={{
        padding: 'var(--monigo-space-4)',
        border: '1px solid var(--monigo-color-border)',
        borderRadius: 'var(--monigo-radius-md)',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={() => onClick?.(wallet)}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(wallet)}
      tabIndex={onClick ? 0 : -1}
      role={onClick ? 'button' : undefined}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--monigo-space-2)' }}>
        <span style={{ fontWeight: 600, fontSize: 'var(--monigo-text-md)' }}>{wallet.currency}</span>
        <span style={{ fontSize: 'var(--monigo-text-xs)', color: statusColor }}>{wallet.status}</span>
      </div>
      <p style={{ fontSize: 'var(--monigo-text-xl)', fontWeight: 700, margin: 0 }}>
        {formatCurrency(wallet.balance, wallet.currency, locale)}
      </p>
    </div>
  )
}
