import React from 'react'
import { useMonigoContext } from '../provider/context'
import { SubscriptionList } from '../components/SubscriptionList'

export interface PortalSubscriptionsPageProps {
  className?: string
}

export function PortalSubscriptionsPage({ className = '' }: PortalSubscriptionsPageProps): React.ReactElement {
  const { messages } = useMonigoContext()
  return (
    <section className={`monigo-page ${className}`}>
      <h1 style={{ fontSize: 'var(--monigo-text-2xl)', marginBottom: 'var(--monigo-space-5)' }}>{messages['subscriptions.title']}</h1>
      <SubscriptionList />
    </section>
  )
}
