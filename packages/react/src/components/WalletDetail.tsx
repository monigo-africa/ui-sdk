import React, { useEffect, useState, useCallback } from 'react'
import { formatCurrency, type PortalWallet } from '@monigo/portal-core'
import { useMonigoContext } from '../provider/context'
import { Skeleton } from './shared/Skeleton'
import { ErrorState } from './shared/ErrorState'

export interface WalletDetailProps {
  walletId: string
  className?: string
}

type DetailState =
  | { status: 'loading' }
  | { status: 'ready'; wallet: PortalWallet }
  | { status: 'error'; error: Error }

export function WalletDetail({ walletId, className = '' }: WalletDetailProps): React.ReactElement {
  const { client, locale, messages } = useMonigoContext()
  const [state, setState] = useState<DetailState>({ status: 'loading' })

  const load = useCallback(async () => {
    setState({ status: 'loading' })
    try {
      const { wallet } = await client.getWallet(walletId)
      setState({ status: 'ready', wallet })
    } catch (err) {
      setState({ status: 'error', error: err instanceof Error ? err : new Error(String(err)) })
    }
  }, [client, walletId])

  useEffect(() => { load() }, [load])

  if (state.status === 'loading') return <Skeleton rows={4} />
  if (state.status === 'error') {
    return <ErrorState error={state.error} onRetry={load} retryLabel={messages['common.retry']} />
  }

  const { wallet } = state

  return (
    <div className={`monigo-wallet-detail ${className}`}>
      <div style={{ padding: 'var(--monigo-space-4)', border: '1px solid var(--monigo-color-border)', borderRadius: 'var(--monigo-radius-md)', marginBottom: 'var(--monigo-space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--monigo-space-3)' }}>
          <span style={{ fontWeight: 600, fontSize: 'var(--monigo-text-lg)' }}>{wallet.currency} Wallet</span>
          <span style={{ fontSize: 'var(--monigo-text-xs)', color: wallet.status === 'active' ? 'var(--monigo-color-success)' : 'var(--monigo-color-muted-fg)' }}>{wallet.status}</span>
        </div>
        <p style={{ fontSize: 'var(--monigo-text-2xl)', fontWeight: 700, margin: '0 0 var(--monigo-space-3)' }}>
          {formatCurrency(wallet.balance, wallet.currency, locale)}
        </p>
        {wallet.virtual_accounts.length > 0 && (
          <div>
            <p style={{ fontSize: 'var(--monigo-text-sm)', fontWeight: 500, margin: '0 0 var(--monigo-space-2)' }}>Bank accounts</p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {wallet.virtual_accounts.map((va) => (
                <li key={va.id} style={{ padding: 'var(--monigo-space-2) 0', borderTop: '1px solid var(--monigo-color-border)', fontSize: 'var(--monigo-text-sm)' }}>
                  <p style={{ margin: '0 0 var(--monigo-space-1)', fontWeight: 500 }}>{va.bank_name ?? va.provider}</p>
                  <p style={{ margin: 0, color: 'var(--monigo-color-muted-fg)' }}>{va.account_number} · {va.account_name}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
