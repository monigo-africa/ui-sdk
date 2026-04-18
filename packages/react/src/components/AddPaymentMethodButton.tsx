import React from 'react'
import { useMonigoContext } from '../provider/context'

export interface AddPaymentMethodButtonProps {
  label?: string
  className?: string
  onAdd?: () => void
}

export function AddPaymentMethodButton({
  label,
  className = '',
  onAdd,
}: AddPaymentMethodButtonProps): React.ReactElement {
  const { messages } = useMonigoContext()

  return (
    <button
      type="button"
      className={`monigo-add-pm-btn ${className}`}
      onClick={onAdd}
      style={{
        padding: 'var(--monigo-space-2) var(--monigo-space-4)',
        background: 'var(--monigo-color-primary)',
        color: 'var(--monigo-color-primary-fg)',
        border: 'none',
        borderRadius: 'var(--monigo-radius-md)',
        fontSize: 'var(--monigo-text-sm)',
        cursor: 'pointer',
      }}
    >
      {label ?? messages['payment_methods.action.add']}
    </button>
  )
}
