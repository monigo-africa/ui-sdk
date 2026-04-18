import React, { useState } from 'react'
import { useMonigoContext } from '../provider/context'

export interface AddPaymentMethodButtonProps {
  label?: string
  className?: string
  onAdd?: () => void
  onUnsupported?: () => void
  onError?: (err: unknown) => void
  onBefore?: () => boolean | Promise<boolean>
}

export function AddPaymentMethodButton({
  label,
  className = '',
  onAdd,
  onUnsupported,
  onError,
  onBefore,
}: AddPaymentMethodButtonProps): React.ReactElement {
  const { client, messages } = useMonigoContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async (): Promise<void> => {
    if (onBefore) {
      const ok = await onBefore()
      if (!ok) return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await client.setupPaymentMethod()
      onAdd?.()
      if (typeof window !== 'undefined') {
        window.location.href = result.authorization_url
      }
    } catch (err) {
      if (err && typeof err === 'object' && 'status' in err && (err as { status: number }).status === 501) {
        onUnsupported?.()
        setError(messages['payment_methods.setup.unsupported'])
      } else {
        setError(err instanceof Error ? err.message : String(err))
        onError?.(err)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        className={`monigo-add-pm-btn ${className}`}
        onClick={handleClick}
        disabled={loading}
        aria-busy={loading}
        style={{
          padding: 'var(--monigo-space-2) var(--monigo-space-4)',
          background: 'var(--monigo-color-primary)',
          color: 'var(--monigo-color-primary-fg)',
          border: 'none',
          borderRadius: 'var(--monigo-radius-md)',
          fontSize: 'var(--monigo-text-sm)',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? messages['common.loading'] : (label ?? messages['payment_methods.action.add'])}
      </button>
      {error && (
        <p role="alert" style={{ color: 'var(--monigo-color-danger)', fontSize: 'var(--monigo-text-sm)', marginTop: 'var(--monigo-space-1)' }}>
          {error}
        </p>
      )}
    </>
  )
}
