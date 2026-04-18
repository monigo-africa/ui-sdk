import React, { useState } from 'react'
import { useMonigoContext } from '../provider/context'
import type { PortalSubscription } from '@monigo/portal-core'

export interface CancelSubscriptionButtonProps {
  subscription: PortalSubscription
  label?: string
  className?: string
  onCancel?: (sub: PortalSubscription) => void
}

export function CancelSubscriptionButton({
  subscription,
  label,
  className = '',
  onCancel,
}: CancelSubscriptionButtonProps): React.ReactElement {
  const { messages } = useMonigoContext()
  const [confirming, setConfirming] = useState(false)

  const handleClick = () => {
    if (!confirming) { setConfirming(true); return }
    setConfirming(false)
    onCancel?.(subscription)
  }

  return (
    <button
      type="button"
      className={`monigo-cancel-sub-btn ${className}`}
      onClick={handleClick}
      style={{
        padding: 'var(--monigo-space-2) var(--monigo-space-4)',
        background: confirming ? 'var(--monigo-color-danger)' : 'transparent',
        color: confirming ? 'var(--monigo-color-danger-fg)' : 'var(--monigo-color-danger)',
        border: '1px solid var(--monigo-color-danger)',
        borderRadius: 'var(--monigo-radius-md)',
        fontSize: 'var(--monigo-text-sm)',
        cursor: 'pointer',
      }}
    >
      {confirming ? messages['subscriptions.cancel.confirm'] : (label ?? messages['subscriptions.action.cancel'])}
    </button>
  )
}
