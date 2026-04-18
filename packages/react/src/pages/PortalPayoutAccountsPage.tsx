import React from 'react'
import { useMonigoContext } from '../provider/context'
import { PayoutAccountList } from '../components/PayoutAccountList'

export interface PortalPayoutAccountsPageProps {
  className?: string
}

export function PortalPayoutAccountsPage({ className = '' }: PortalPayoutAccountsPageProps): React.ReactElement {
  const { messages } = useMonigoContext()
  return (
    <section className={`monigo-page ${className}`}>
      <h1 style={{ fontSize: 'var(--monigo-text-2xl)', marginBottom: 'var(--monigo-space-5)' }}>{messages['payout_accounts.title']}</h1>
      <PayoutAccountList />
    </section>
  )
}
