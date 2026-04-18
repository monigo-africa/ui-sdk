import React, { useState } from 'react'
import { useMonigoContext } from '../provider/context'

export interface SetDefaultPaymentMethodButtonProps {
  paymentMethodId: string
  label?: string
  className?: string
  onSet?: () => void
  onError?: (err: unknown) => void
}

export function SetDefaultPaymentMethodButton({
  paymentMethodId,
  label,
  className = '',
  onSet,
  onError,
}: SetDefaultPaymentMethodButtonProps): React.ReactElement {
  const { client, messages } = useMonigoContext()
  const [loading, setLoading] = useState(false)

  const handleSet = async () => {
    setLoading(true)
    try {
      await client.setDefaultPaymentMethod(paymentMethodId)
      onSet?.()
    } catch (err) {
      onError?.(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      className={`monigo-set-default-pm-btn ${className}`}
      onClick={handleSet}
      disabled={loading}
      style={{
        padding: 'var(--monigo-space-1) var(--monigo-space-3)',
        background: 'transparent',
        color: 'var(--monigo-color-primary)',
        border: '1px solid var(--monigo-color-primary)',
        borderRadius: 'var(--monigo-radius-sm)',
        fontSize: 'var(--monigo-text-xs)',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? messages['common.loading'] : (label ?? messages['payment_methods.action.default'])}
    </button>
  )
}
