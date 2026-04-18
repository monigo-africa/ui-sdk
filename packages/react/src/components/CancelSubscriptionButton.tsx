import React, { useState } from 'react'
import { useMonigoContext } from '../provider/context'
import type { PortalSubscription } from '@monigo/portal-core'

export interface CancelSubscriptionButtonProps {
  subscription: PortalSubscription
  label?: string
  className?: string
  onCancel?: (sub: PortalSubscription) => void
  onError?: (err: unknown) => void
}

export function CancelSubscriptionButton({
  subscription,
  label,
  className = '',
  onCancel,
  onError,
}: CancelSubscriptionButtonProps): React.ReactElement {
  const { client, messages } = useMonigoContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async (): Promise<void> => {
    if (typeof window === 'undefined') return
    const confirmed = window.confirm(messages['subscriptions.cancel.confirm'])
    if (!confirmed) return

    setLoading(true)
    setError(null)
    try {
      await client.cancelSubscription(subscription.id)
      onCancel?.(subscription)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      onError?.(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        className={`monigo-cancel-sub-btn ${className}`}
        onClick={handleClick}
        disabled={loading}
        aria-busy={loading}
        style={{
          padding: 'var(--monigo-space-2) var(--monigo-space-4)',
          background: 'transparent',
          color: 'var(--monigo-color-danger)',
          border: '1px solid var(--monigo-color-danger)',
          borderRadius: 'var(--monigo-radius-md)',
          fontSize: 'var(--monigo-text-sm)',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? messages['common.loading'] : (label ?? messages['subscriptions.action.cancel'])}
      </button>
      {error && (
        <p role="alert" style={{ color: 'var(--monigo-color-danger)', fontSize: 'var(--monigo-text-sm)', marginTop: 'var(--monigo-space-1)' }}>
          {error}
        </p>
      )}
    </>
  )
}
