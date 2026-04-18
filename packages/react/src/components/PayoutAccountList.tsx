import React, { useEffect } from 'react'
import { useMonigoContext } from '../provider/context'
import { usePayoutAccounts } from '../hooks/usePayoutAccounts'
import { PayoutAccountCard } from './PayoutAccountCard'
import { Skeleton } from './shared/Skeleton'
import { EmptyState } from './shared/EmptyState'
import { ErrorState } from './shared/ErrorState'

export interface PayoutAccountListProps {
  className?: string
}

export function PayoutAccountList({ className = '' }: PayoutAccountListProps): React.ReactElement {
  const { client, messages } = useMonigoContext()
  const { state, dispatch } = usePayoutAccounts(client)

  useEffect(() => { dispatch({ type: 'load' }) }, [dispatch])

  if (state.status === 'idle' || state.status === 'loading') return <Skeleton rows={3} />
  if (state.status === 'error') {
    return <ErrorState error={state.error} onRetry={() => dispatch({ type: 'refresh' })} retryLabel={messages['common.retry']} />
  }
  if (state.payoutAccounts.length === 0) return <EmptyState message={messages['payout_accounts.empty']} />

  return (
    <div className={`monigo-payout-account-list ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--monigo-space-3)' }}>
      {state.payoutAccounts.map((account) => (
        <PayoutAccountCard key={account.id} account={account} />
      ))}
    </div>
  )
}
