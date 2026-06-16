<script lang="ts">
  import { tick } from 'svelte'
  import {
    launchCheckout, createBalancePoller, formatCurrency,
    type PortalWallet, type BalancePoller,
  } from '@monigo/portal-core'
  import { getMonigoContext } from '../provider/context'

  interface Props {
    walletId: string
    currency: string
    presets?: number[]
    pollIntervalMs?: number
    onfunded?: (reference: string) => void
    onerror?: (err: unknown) => void
    class?: string
  }
  const {
    walletId, currency, presets = [1000, 5000, 10000],
    pollIntervalMs = 8000, onfunded, onerror, class: className = '',
  }: Props = $props()

  const { client, messages, locale } = getMonigoContext()

  type View = 'loading' | 'ready' | 'error' | 'funding' | 'confirming'
  let view = $state<View>('loading')
  let balance = $state('0')
  let status = $state<PortalWallet['status']>('active')
  let amount = $state<string | number>('')
  let open = $state(false)
  let showStripe = $state(false)
  let stripeMount = $state<HTMLDivElement | undefined>(undefined)
  let poller: BalancePoller | undefined
  let abortController: AbortController | undefined

  $effect(() => {
    let cancelled = false
    poller = createBalancePoller(client, walletId, {
      intervalMs: pollIntervalMs,
      onBalance: (b, w) => {
        if (cancelled) return
        balance = b
        status = w.status
        if (view === 'loading') view = 'ready'
      },
      onError: (err) => {
        if (cancelled) return
        if (view === 'loading') view = 'error'
        onerror?.(err)
      },
    })
    poller.start()
    return () => {
      cancelled = true
      poller?.stop()
      abortController?.abort() // tear down any in-flight Stripe checkout on unmount
    }
  })

  async function fund() {
    const amountStr = String(amount)
    const amt = parseFloat(amountStr)
    if (!amt || amt <= 0) return
    view = 'funding'
    abortController = new AbortController()
    try {
      const session = await client.initWalletFunding(walletId, { amount: amountStr, currency })
      showStripe = session.provider === 'stripe'
      await tick() // flush the {#if showStripe} block so bind:this={stripeMount} fires
      const result = await launchCheckout(session, {
        ...(stripeMount ? { mountEl: stripeMount } : {}),
        signal: abortController.signal,
      })
      showStripe = false
      if (result.status === 'success') {
        view = 'confirming'
        try {
          await poller?.refreshNow()
        } catch {
          /* poller onError already surfaces this */
        }
        view = 'ready'
        open = false
        amount = ''
        onfunded?.(result.reference)
      } else {
        view = 'ready' // closed or failed
      }
    } catch (err) {
      showStripe = false
      try {
        const redirect = await client.fundWallet(walletId, { amount: amountStr, currency })
        if (typeof window !== 'undefined') { window.location.href = redirect.authorization_url; return }
      } catch { /* fall through to error surface */ }
      view = 'ready'
      onerror?.(err)
    }
  }

  function cancelFunding() {
    abortController?.abort() // resolves Stripe as 'closed'
    showStripe = false
    open = false
    amount = ''
    if (view === 'funding' || view === 'confirming') view = 'ready'
  }
</script>

<section class="monigo-wallet-widget {className}">
  <header class="row">
    <span class="label">{currency} balance</span>
    <span class="status">{status}</span>
  </header>

  {#if view === 'loading'}
    <p class="balance muted">…</p>
  {:else if view === 'error'}
    <p class="balance error">Unable to load balance</p>
  {:else}
    <p class="balance font-numeric">{formatCurrency(balance, currency, locale)}</p>
  {/if}

  {#if !open}
    <button type="button" class="primary" onclick={() => (open = true)} disabled={view === 'loading'}>
      {messages['wallets.action.fund']}
    </button>
  {:else}
    <form onsubmit={(e) => { e.preventDefault(); fund() }}>
      <div class="presets">
        {#each presets as p}
          <button type="button" class="chip" onclick={() => (amount = String(p))} disabled={view === 'funding'}>
            {formatCurrency(String(p), currency, locale)}
          </button>
        {/each}
      </div>
      <label>
        <span class="sr-only">Amount</span>
        <input type="number" step="0.01" min="0" bind:value={amount}
          placeholder={`Amount (${currency})`} required disabled={view === 'funding'} />
      </label>
      <div class="row">
        <button type="submit" class="primary" disabled={view === 'funding' || !amount}>
          {view === 'funding' ? messages['common.loading'] : messages['common.confirm']}
        </button>
        <button type="button" class="ghost" onclick={cancelFunding} disabled={view === 'confirming'}>
          {messages['common.cancel']}
        </button>
      </div>
    </form>
  {/if}

  {#if view === 'confirming'}<p class="muted small">Confirming payment…</p>{/if}
  {#if showStripe}<div class="stripe-mount" bind:this={stripeMount}></div>{/if}
</section>

<style>
  .monigo-wallet-widget {
    padding: var(--monigo-space-5);
    border: 1px solid var(--monigo-color-border);
    border-radius: var(--monigo-radius-lg);
    background: var(--monigo-color-bg);
    display: flex;
    flex-direction: column;
    gap: var(--monigo-space-3);
  }
  .row { display: flex; justify-content: space-between; align-items: center; gap: var(--monigo-space-2); }
  .label { font-weight: 600; }
  .status { font-size: var(--monigo-text-xs); color: var(--monigo-color-muted-fg); text-transform: uppercase; }
  .balance { font-size: var(--monigo-text-2xl); font-weight: 700; margin: 0; }
  .balance.error { color: var(--monigo-color-danger); font-size: var(--monigo-text-md); }
  .muted { color: var(--monigo-color-muted-fg); }
  .small { font-size: var(--monigo-text-sm); }
  .presets { display: flex; gap: var(--monigo-space-2); flex-wrap: wrap; }
  .chip { padding: var(--monigo-space-1) var(--monigo-space-3); border: 1px solid var(--monigo-color-border);
    border-radius: var(--monigo-radius-md); background: var(--monigo-color-muted); cursor: pointer; font-size: var(--monigo-text-sm); }
  input { padding: var(--monigo-space-2); border: 1px solid var(--monigo-color-border);
    border-radius: var(--monigo-radius-sm); font-size: var(--monigo-text-sm); width: 100%; }
  .primary { padding: var(--monigo-space-2) var(--monigo-space-4); background: var(--monigo-color-primary);
    color: var(--monigo-color-primary-fg); border: none; border-radius: var(--monigo-radius-md);
    font-size: var(--monigo-text-sm); cursor: pointer; }
  .primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .ghost { padding: var(--monigo-space-2) var(--monigo-space-3); background: transparent;
    color: var(--monigo-color-muted-fg); border: 1px solid var(--monigo-color-border);
    border-radius: var(--monigo-radius-md); cursor: pointer; }
  .stripe-mount { margin-top: var(--monigo-space-3); }
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
</style>
