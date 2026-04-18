import React from 'react'
import type { CustomerPaymentMethod } from '@monigo/portal-core'

export interface PaymentMethodCardProps {
  method: CustomerPaymentMethod
  className?: string
}

export function PaymentMethodCard({ method, className = '' }: PaymentMethodCardProps): React.ReactElement {
  const displayName = method.brand
    ? `${method.brand.charAt(0).toUpperCase()}${method.brand.slice(1)}`
    : method.type

  const expiry = method.exp_month !== null && method.exp_year !== null
    ? `${String(method.exp_month).padStart(2, '0')} / ${String(method.exp_year).slice(-2)}`
    : null

  return (
    <div
      className={`monigo-pm-card ${className}`}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--monigo-space-3) var(--monigo-space-4)',
        border: '1px solid var(--monigo-color-border)',
        borderRadius: 'var(--monigo-radius-md)',
      }}
    >
      <div>
        <span style={{ fontWeight: 500, fontSize: 'var(--monigo-text-sm)' }}>
          {displayName}{method.last4 ? ` •••• ${method.last4}` : ''}
        </span>
        {expiry && (
          <p style={{ margin: '2px 0 0', fontSize: 'var(--monigo-text-xs)', color: 'var(--monigo-color-muted-fg)' }}>
            Expires {expiry}
          </p>
        )}
      </div>
      {method.is_default && (
        <span style={{
          fontSize: 'var(--monigo-text-xs)',
          padding: '2px var(--monigo-space-2)',
          background: 'color-mix(in srgb, var(--monigo-color-primary) 15%, transparent)',
          color: 'var(--monigo-color-primary)',
          borderRadius: 'var(--monigo-radius-sm)',
          fontWeight: 500,
        }}>
          Default
        </span>
      )}
    </div>
  )
}
