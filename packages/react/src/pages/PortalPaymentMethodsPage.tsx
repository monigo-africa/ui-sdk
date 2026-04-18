import React from 'react'
import { useMonigoContext } from '../provider/context'
import { PaymentMethodList } from '../components/PaymentMethodList'

export interface PortalPaymentMethodsPageProps {
  className?: string
}

export function PortalPaymentMethodsPage({ className = '' }: PortalPaymentMethodsPageProps): React.ReactElement {
  const { messages } = useMonigoContext()
  return (
    <section className={`monigo-page ${className}`}>
      <h1 style={{ fontSize: 'var(--monigo-text-2xl)', marginBottom: 'var(--monigo-space-5)' }}>{messages['payment_methods.title']}</h1>
      <PaymentMethodList />
    </section>
  )
}
