import React from 'react'
import type { CustomerPayoutAccount } from '@monigo/portal-core'

export interface PayoutAccountCardProps {
  account: CustomerPayoutAccount
  className?: string
}

export function PayoutAccountCard({ account, className = '' }: PayoutAccountCardProps): React.ReactElement {
  const maskedAccount = account.account_number
    ? `•••• ${account.account_number.slice(-4)}`
    : account.mobile_money_number
      ? `•••• ${account.mobile_money_number.slice(-4)}`
      : null

  return (
    <div
      className={`monigo-payout-account-card ${className}`}
      style={{
        padding: 'var(--monigo-space-4)',
        border: '1px solid var(--monigo-color-border)',
        borderRadius: 'var(--monigo-radius-md)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--monigo-space-2)' }}>
        <span style={{ fontWeight: 600, fontSize: 'var(--monigo-text-sm)' }}>{account.account_name}</span>
        <span style={{ fontSize: 'var(--monigo-text-xs)', color: 'var(--monigo-color-muted-fg)' }}>{account.payout_method}</span>
      </div>
      {account.bank_name && (
        <p style={{ margin: '0 0 var(--monigo-space-1)', fontSize: 'var(--monigo-text-xs)', color: 'var(--monigo-color-muted-fg)' }}>
          {account.bank_name}
        </p>
      )}
      {maskedAccount && (
        <p style={{ margin: 0, fontSize: 'var(--monigo-text-xs)', color: 'var(--monigo-color-muted-fg)' }}>
          {maskedAccount}
        </p>
      )}
      <p style={{ margin: '4px 0 0', fontSize: 'var(--monigo-text-xs)', color: 'var(--monigo-color-muted-fg)' }}>
        {account.currency}
      </p>
    </div>
  )
}
