import React, { useState } from 'react'
import { useMonigoContext } from '../provider/context'

export interface RemovePaymentMethodButtonProps {
  paymentMethodId: string
  label?: string
  className?: string
  onRemove?: () => void
  onError?: (err: unknown) => void
}

export function RemovePaymentMethodButton({
  paymentMethodId,
  label,
  className = '',
  onRemove,
  onError,
}: RemovePaymentMethodButtonProps): React.ReactElement {
  const { client, messages } = useMonigoContext()
  const [loading, setLoading] = useState(false)

  const handleRemove = async () => {
    if (!window.confirm('Remove this payment method?')) return
    setLoading(true)
    try {
      await client.deletePaymentMethod(paymentMethodId)
      onRemove?.()
    } catch (err) {
      onError?.(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      className={`monigo-remove-pm-btn ${className}`}
      onClick={handleRemove}
      disabled={loading}
      style={{
        padding: 'var(--monigo-space-1) var(--monigo-space-3)',
        background: 'transparent',
        color: 'var(--monigo-color-danger)',
        border: '1px solid var(--monigo-color-danger)',
        borderRadius: 'var(--monigo-radius-sm)',
        fontSize: 'var(--monigo-text-xs)',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? messages['common.loading'] : (label ?? messages['payment_methods.action.remove'])}
    </button>
  )
}
