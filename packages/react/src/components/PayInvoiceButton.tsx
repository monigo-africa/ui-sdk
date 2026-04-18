import React, { useState } from 'react'
import { useMonigoContext } from '../provider/context'

export interface PayInvoiceButtonProps {
  invoiceId: string
  label?: string
  className?: string
  onBefore?: () => boolean | Promise<boolean>
  onSuccess?: (result: { authorization_url: string }) => void
  onError?: (err: unknown) => void
}

export function PayInvoiceButton({
  invoiceId,
  label,
  className = '',
  onBefore,
  onSuccess,
  onError,
}: PayInvoiceButtonProps): React.ReactElement {
  const { client, messages } = useMonigoContext()
  const [loading, setLoading] = useState(false)

  const pay = async () => {
    if (onBefore) {
      const ok = await onBefore()
      if (!ok) return
    }
    setLoading(true)
    try {
      const result = await client.payInvoice(invoiceId)
      onSuccess?.(result)
      if (typeof window !== 'undefined') {
        window.location.href = result.authorization_url
      }
    } catch (err) {
      onError?.(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      className={`monigo-pay-btn ${className}`}
      onClick={pay}
      disabled={loading}
      aria-busy={loading}
      style={{
        padding: 'var(--monigo-space-3) var(--monigo-space-5)',
        background: 'var(--monigo-color-primary)',
        color: 'var(--monigo-color-primary-fg)',
        border: 'none',
        borderRadius: 'var(--monigo-radius-md)',
        fontSize: 'var(--monigo-text-md)',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? messages['common.loading'] : (label ?? messages['invoices.action.pay'])}
    </button>
  )
}
