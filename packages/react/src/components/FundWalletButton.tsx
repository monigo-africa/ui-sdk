import React, { useState } from 'react'
import { useMonigoContext } from '../provider/context'

export interface FundWalletButtonProps {
  walletId: string
  currency: string
  label?: string
  className?: string
  onSuccess?: (result: { authorization_url: string }) => void
  onError?: (err: unknown) => void
}

export function FundWalletButton({
  walletId,
  currency,
  label,
  className = '',
  onSuccess,
  onError,
}: FundWalletButtonProps): React.ReactElement {
  const { client, messages } = useMonigoContext()
  const [showInput, setShowInput] = useState(false)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFund = async () => {
    if (!amount || parseFloat(amount) <= 0) return
    setLoading(true)
    try {
      const result = await client.fundWallet(walletId, { amount, currency })
      onSuccess?.(result)
      setShowInput(false)
      setAmount('')
      if (typeof window !== 'undefined') {
        window.location.href = result.authorization_url
      }
    } catch (err) {
      onError?.(err)
    } finally {
      setLoading(false)
    }
  }

  if (!showInput) {
    return (
      <button
        type="button"
        className={`monigo-fund-btn ${className}`}
        onClick={() => setShowInput(true)}
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
        {label ?? messages['wallets.action.fund']}
      </button>
    )
  }

  return (
    <div className={`monigo-fund-form ${className}`} style={{ display: 'flex', gap: 'var(--monigo-space-2)', alignItems: 'center' }}>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        min="0"
        style={{
          padding: 'var(--monigo-space-2)',
          border: '1px solid var(--monigo-color-border)',
          borderRadius: 'var(--monigo-radius-sm)',
          fontSize: 'var(--monigo-text-sm)',
          width: '120px',
        }}
      />
      <button
        type="button"
        onClick={handleFund}
        disabled={loading || !amount}
        style={{
          padding: 'var(--monigo-space-2) var(--monigo-space-3)',
          background: 'var(--monigo-color-primary)',
          color: 'var(--monigo-color-primary-fg)',
          border: 'none',
          borderRadius: 'var(--monigo-radius-sm)',
          fontSize: 'var(--monigo-text-sm)',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? messages['common.loading'] : messages['common.confirm']}
      </button>
      <button
        type="button"
        onClick={() => { setShowInput(false); setAmount('') }}
        style={{
          padding: 'var(--monigo-space-2) var(--monigo-space-3)',
          background: 'transparent',
          color: 'var(--monigo-color-muted-fg)',
          border: '1px solid var(--monigo-color-border)',
          borderRadius: 'var(--monigo-radius-sm)',
          fontSize: 'var(--monigo-text-sm)',
          cursor: 'pointer',
        }}
      >
        {messages['common.cancel']}
      </button>
    </div>
  )
}
