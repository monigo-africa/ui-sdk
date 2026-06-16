import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import {
  launchCheckout, createBalancePoller, formatCurrency,
  type PortalWallet, type BalancePoller,
} from '@monigo/portal-core'
import { useMonigoContext } from '../provider/context'

export interface WalletWidgetProps {
  walletId: string
  currency: string
  presets?: number[]
  pollIntervalMs?: number
  onFunded?: (reference: string) => void
  onError?: (err: unknown) => void
  className?: string
}

type View = 'loading' | 'ready' | 'error' | 'funding' | 'confirming'

export function WalletWidget({
  walletId, currency, presets = [1000, 5000, 10000],
  pollIntervalMs = 8000, onFunded, onError, className = '',
}: WalletWidgetProps): React.ReactElement {
  const { client, messages, locale } = useMonigoContext()
  const [view, setView] = useState<View>('loading')
  const [balance, setBalance] = useState('0')
  const [status, setStatus] = useState<PortalWallet['status']>('active')
  const [amount, setAmount] = useState('')
  const [open, setOpen] = useState(false)
  const [showStripe, setShowStripe] = useState(false)
  const stripeMount = useRef<HTMLDivElement>(null)
  const pollerRef = useRef<BalancePoller | undefined>(undefined)
  const abortRef = useRef<AbortController | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    const poller = createBalancePoller(client, walletId, {
      intervalMs: pollIntervalMs,
      onBalance: (b, w) => {
        if (cancelled) return
        setBalance(b); setStatus(w.status)
        setView((v) => (v === 'loading' ? 'ready' : v))
      },
      onError: (err) => {
        if (cancelled) return
        setView((v) => (v === 'loading' ? 'error' : v)); onError?.(err)
      },
    })
    pollerRef.current = poller
    poller.start()
    return () => { cancelled = true; poller.stop(); abortRef.current?.abort() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, walletId, pollIntervalMs])

  const fund = async () => {
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) return
    setView('funding')
    const controller = new AbortController()
    abortRef.current = controller
    try {
      const session = await client.initWalletFunding(walletId, { amount, currency })
      if (session.provider === 'stripe') {
        // Flush the mount <div> into the DOM so its ref attaches before launch.
        flushSync(() => setShowStripe(true))
      }
      const result = await launchCheckout(session, {
        ...(stripeMount.current ? { mountEl: stripeMount.current } : {}),
        signal: controller.signal,
      })
      setShowStripe(false)
      if (result.status === 'success') {
        setView('confirming')
        try { await pollerRef.current?.refreshNow() } catch { /* surfaced via onError */ }
        setView('ready'); setOpen(false); setAmount('')
        onFunded?.(result.reference)
      } else {
        setView('ready')
      }
    } catch (err) {
      setShowStripe(false)
      try {
        const redirect = await client.fundWallet(walletId, { amount, currency })
        if (typeof window !== 'undefined') { window.location.href = redirect.authorization_url; return }
      } catch { /* ignore */ }
      setView('ready'); onError?.(err)
    }
  }

  const cancelFunding = () => {
    abortRef.current?.abort()
    setShowStripe(false); setOpen(false); setAmount('')
    setView((v) => (v === 'funding' || v === 'confirming' ? 'ready' : v))
  }

  const card: React.CSSProperties = {
    padding: 'var(--monigo-space-5)', border: '1px solid var(--monigo-color-border)',
    borderRadius: 'var(--monigo-radius-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--monigo-space-3)',
  }
  const primaryBtn: React.CSSProperties = {
    padding: 'var(--monigo-space-2) var(--monigo-space-4)', background: 'var(--monigo-color-primary)',
    color: 'var(--monigo-color-primary-fg)', border: 'none', borderRadius: 'var(--monigo-radius-md)',
    fontSize: 'var(--monigo-text-sm)', cursor: 'pointer',
  }

  return (
    <section className={`monigo-wallet-widget ${className}`} style={card}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 600 }}>{currency} balance</span>
        <span style={{ fontSize: 'var(--monigo-text-xs)', color: 'var(--monigo-color-muted-fg)', textTransform: 'uppercase' }}>{status}</span>
      </div>

      {view === 'loading' ? (
        <p style={{ margin: 0, color: 'var(--monigo-color-muted-fg)' }}>…</p>
      ) : view === 'error' ? (
        <p style={{ margin: 0, color: 'var(--monigo-color-danger)' }}>Unable to load balance</p>
      ) : (
        <p className="font-numeric" style={{ fontSize: 'var(--monigo-text-2xl)', fontWeight: 700, margin: 0 }}>
          {formatCurrency(balance, currency, locale)}
        </p>
      )}

      {!open ? (
        <button type="button" style={primaryBtn} onClick={() => setOpen(true)} disabled={view === 'loading'}>
          {messages['wallets.action.fund']}
        </button>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); void fund() }} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--monigo-space-2)' }}>
          <div style={{ display: 'flex', gap: 'var(--monigo-space-2)', flexWrap: 'wrap' }}>
            {presets.map((p) => (
              <button key={p} type="button" onClick={() => setAmount(String(p))} disabled={view === 'funding'}
                style={{ padding: 'var(--monigo-space-1) var(--monigo-space-3)', border: '1px solid var(--monigo-color-border)', borderRadius: 'var(--monigo-radius-md)', background: 'var(--monigo-color-muted)', cursor: 'pointer', fontSize: 'var(--monigo-text-sm)' }}>
                {formatCurrency(String(p), currency, locale)}
              </button>
            ))}
          </div>
          <input type="number" step="0.01" min="0" required value={amount} aria-label="Amount"
            onChange={(e) => setAmount(e.target.value)} placeholder={`Amount (${currency})`} disabled={view === 'funding'}
            style={{ padding: 'var(--monigo-space-2)', border: '1px solid var(--monigo-color-border)', borderRadius: 'var(--monigo-radius-sm)', fontSize: 'var(--monigo-text-sm)' }} />
          <div style={{ display: 'flex', gap: 'var(--monigo-space-2)' }}>
            <button type="submit" style={primaryBtn} disabled={view === 'funding' || !amount}>
              {view === 'funding' ? messages['common.loading'] : messages['common.confirm']}
            </button>
            <button type="button" onClick={cancelFunding} disabled={view === 'confirming'}
              style={{ padding: 'var(--monigo-space-2) var(--monigo-space-3)', background: 'transparent', color: 'var(--monigo-color-muted-fg)', border: '1px solid var(--monigo-color-border)', borderRadius: 'var(--monigo-radius-md)', cursor: 'pointer' }}>
              {messages['common.cancel']}
            </button>
          </div>
        </form>
      )}

      {view === 'confirming' && <p style={{ margin: 0, color: 'var(--monigo-color-muted-fg)', fontSize: 'var(--monigo-text-sm)' }}>Confirming payment…</p>}
      {showStripe && <div ref={stripeMount} style={{ marginTop: 'var(--monigo-space-3)' }} />}
    </section>
  )
}
