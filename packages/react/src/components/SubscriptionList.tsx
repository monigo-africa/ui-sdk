import React, { useEffect } from 'react'
import { useMonigoContext } from '../provider/context'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { SubscriptionCard } from './SubscriptionCard'
import { Skeleton } from './shared/Skeleton'
import { EmptyState } from './shared/EmptyState'
import { ErrorState } from './shared/ErrorState'

export interface SubscriptionListProps {
  className?: string
}

export function SubscriptionList({ className = '' }: SubscriptionListProps): React.ReactElement {
  const { client, messages } = useMonigoContext()
  const { state, dispatch } = useSubscriptions(client)

  useEffect(() => { dispatch({ type: 'load' }) }, [dispatch])

  if (state.status === 'idle' || state.status === 'loading') return <Skeleton rows={3} />
  if (state.status === 'error') {
    return <ErrorState error={state.error} onRetry={() => dispatch({ type: 'refresh' })} retryLabel={messages['common.retry']} />
  }
  if (state.subscriptions.length === 0) return <EmptyState message={messages['subscriptions.empty']} />

  return (
    <div className={`monigo-sub-list ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--monigo-space-3)' }}>
      {state.subscriptions.map((sub) => (
        <SubscriptionCard key={sub.id} subscription={sub} />
      ))}
    </div>
  )
}
