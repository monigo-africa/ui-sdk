import React from 'react'
import { formatInvoiceStatus } from '@monigo/portal-core'

export interface InvoiceStatusBadgeProps {
  status: string
  className?: string
}

const variantStyles: Record<string, React.CSSProperties> = {
  success: {
    background: 'color-mix(in srgb, var(--monigo-color-success) 15%, transparent)',
    color: 'var(--monigo-color-success)',
  },
  danger: {
    background: 'color-mix(in srgb, var(--monigo-color-danger) 15%, transparent)',
    color: 'var(--monigo-color-danger)',
  },
  warning: {
    background: 'color-mix(in srgb, var(--monigo-color-warning) 15%, transparent)',
    color: 'var(--monigo-color-warning)',
  },
  muted: {
    background: 'var(--monigo-color-muted)',
    color: 'var(--monigo-color-muted-fg)',
  },
}

const baseStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '2px var(--monigo-space-2)',
  borderRadius: 'var(--monigo-radius-sm)',
  fontSize: 'var(--monigo-text-xs)',
  fontWeight: 500,
  lineHeight: 1.4,
}

export function InvoiceStatusBadge({ status, className = '' }: InvoiceStatusBadgeProps): React.ReactElement {
  const variant =
    status === 'paid' ? 'success' :
    status === 'payment_failed' ? 'danger' :
    status === 'finalized' ? 'warning' :
    'muted'

  return (
    <span className={`monigo-badge ${className}`} style={{ ...baseStyle, ...variantStyles[variant] }}>
      {formatInvoiceStatus(status)}
    </span>
  )
}
