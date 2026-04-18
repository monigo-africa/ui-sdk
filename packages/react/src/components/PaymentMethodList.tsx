import React, { useEffect } from 'react'
import { useMonigoContext } from '../provider/context'
import { usePaymentMethods } from '../hooks/usePaymentMethods'
import { PaymentMethodCard } from './PaymentMethodCard'
import { RemovePaymentMethodButton } from './RemovePaymentMethodButton'
import { SetDefaultPaymentMethodButton } from './SetDefaultPaymentMethodButton'
import { Skeleton } from './shared/Skeleton'
import { EmptyState } from './shared/EmptyState'
import { ErrorState } from './shared/ErrorState'

export interface PaymentMethodListProps {
  className?: string
}

export function PaymentMethodList({ className = '' }: PaymentMethodListProps): React.ReactElement {
  const { client, messages } = useMonigoContext()
  const { state, dispatch } = usePaymentMethods(client)

  useEffect(() => { dispatch({ type: 'load' }) }, [dispatch])

  if (state.status === 'idle' || state.status === 'loading') return <Skeleton rows={3} />
  if (state.status === 'error') {
    return <ErrorState error={state.error} onRetry={() => dispatch({ type: 'refresh' })} retryLabel={messages['common.retry']} />
  }
  if (state.paymentMethods.length === 0) return <EmptyState message={messages['payment_methods.empty']} />

  return (
    <div className={`monigo-pm-list ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--monigo-space-2)' }}>
      {state.paymentMethods.map((method) => (
        <div key={method.id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--monigo-space-1)' }}>
          <PaymentMethodCard method={method} />
          <div style={{ display: 'flex', gap: 'var(--monigo-space-2)', paddingLeft: 'var(--monigo-space-1)' }}>
            {!method.is_default && (
              <SetDefaultPaymentMethodButton
                paymentMethodId={method.id}
                onSet={() => dispatch({ type: 'refresh' })}
              />
            )}
            <RemovePaymentMethodButton
              paymentMethodId={method.id}
              onRemove={() => dispatch({ type: 'refresh' })}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
