import React from 'react'
import { formatSubscriptionStatus, formatDate, type PortalSubscription } from '@monigo/portal-core'

export interface SubscriptionCardProps {
  subscription: PortalSubscription
  className?: string
}

export function SubscriptionCard({ subscription: sub, className = '' }: SubscriptionCardProps): React.ReactElement {
  const statusColor = sub.status === 'active' || (sub.status as string) === 'trialing' ? 'var(--monigo-color-success)' : 'var(--monigo-color-muted-fg)'
  return (
    <div
      className={`monigo-sub-card ${className}`}
      style={{ padding: 'var(--monigo-space-4)', border: '1px solid var(--monigo-color-border)', borderRadius: 'var(--monigo-radius-md)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--monigo-space-2)' }}>
        <span style={{ fontWeight: 600, fontSize: 'var(--monigo-text-md)' }}>
          {(sub as PortalSubscription & { plan_name?: string }).plan_name ?? sub.id}
        </span>
        <span style={{ fontSize: 'var(--monigo-text-xs)', color: statusColor }}>{formatSubscriptionStatus(sub.status)}</span>
      </div>
      {(sub as PortalSubscription & { plan_type?: string }).plan_type && (
        <p style={{ fontSize: 'var(--monigo-text-xs)', color: 'var(--monigo-color-muted-fg)', margin: '0 0 var(--monigo-space-1)' }}>
          {(sub as PortalSubscription & { plan_type?: string }).plan_type}
        </p>
      )}
      {sub.current_period_end && (
        <p style={{ fontSize: 'var(--monigo-text-xs)', color: 'var(--monigo-color-muted-fg)', margin: 0 }}>
          Next billing: {formatDate(sub.current_period_end)}
        </p>
      )}
    </div>
  )
}
