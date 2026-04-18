<script lang="ts">
  import { onMount } from 'svelte'
  import { getMonigoContext } from '../provider/context'
  import { formatCurrency, formatDate, type PortalInvoice, type PaymentTransaction } from '@monigo/portal-core'
  import InvoiceStatusBadge from './InvoiceStatusBadge.svelte'
  import PayInvoiceButton from './PayInvoiceButton.svelte'
  import Skeleton from './shared/Skeleton.svelte'
  import ErrorState from './shared/ErrorState.svelte'

  interface Props { invoiceId: string; class?: string }
  const { invoiceId, class: className = '' }: Props = $props()
  const { client, locale, messages } = getMonigoContext()

  type DetailState =
    | { status: 'loading' }
    | { status: 'ready'; invoice: PortalInvoice; transactions: PaymentTransaction[] }
    | { status: 'error'; error: Error }

  let state = $state<DetailState>({ status: 'loading' })

  async function load() {
    state = { status: 'loading' }
    try {
      const [{ invoice }, txRes] = await Promise.all([
        client.getInvoice(invoiceId),
        client.getInvoiceTransactions(invoiceId).catch(() => ({ transactions: [] as PaymentTransaction[] })),
      ])
      state = { status: 'ready', invoice, transactions: txRes.transactions }
    } catch (err) {
      state = { status: 'error', error: err instanceof Error ? err : new Error(String(err)) }
    }
  }

  onMount(load)
</script>

<article class="invoice-detail {className}">
  {#if state.status === 'loading'}
    <Skeleton rows={6} />
  {:else if state.status === 'error'}
    <ErrorState error={state.error} onRetry={load} retryLabel={messages['common.retry']} />
  {:else}
    <header class="head">
      <div>
        <h2>{state.invoice.id}</h2>
        <p class="muted">{formatDate(state.invoice.created_at, locale)}</p>
      </div>
      <div class="right">
        <p class="amount">{formatCurrency(state.invoice.total, state.invoice.currency, locale)}</p>
        <InvoiceStatusBadge status={state.invoice.status} />
      </div>
    </header>

    {#if state.invoice.status === 'finalized'}
      <PayInvoiceButton invoiceId={state.invoice.id} />
    {/if}

    {#if state.invoice.line_items?.length}
      <section class="lines">
        <h3>Line items</h3>
        <ul>
          {#each state.invoice.line_items as line, i (i)}
            <li class="line">
              <span>{line.description}</span>
              <span>{formatCurrency(line.amount, state.invoice.currency, locale)}</span>
            </li>
          {/each}
        </ul>
      </section>
    {/if}

    {#if state.transactions.length}
      <section class="transactions">
        <h3>Payment history</h3>
        <ul>
          {#each state.transactions as t (t.id)}
            <li class="tx">
              <span>{formatDate(t.created_at, locale)}</span>
              <span>{formatCurrency(t.amount, t.currency, locale)}</span>
              <span>{t.status}</span>
            </li>
          {/each}
        </ul>
      </section>
    {/if}
  {/if}
</article>

<style>
  .head { display: flex; justify-content: space-between; align-items: flex-start; padding: var(--monigo-space-6) 0; border-bottom: 1px solid var(--monigo-color-border); }
  .right { text-align: right; }
  .amount { font-size: var(--monigo-text-2xl); font-weight: 600; margin-bottom: var(--monigo-space-2); }
  .muted { color: var(--monigo-color-muted-fg); font-size: var(--monigo-text-sm); }
  section { padding: var(--monigo-space-5) 0; }
  h2 { margin: 0 0 var(--monigo-space-1) 0; font-size: var(--monigo-text-xl); }
  h3 { margin: 0 0 var(--monigo-space-3) 0; font-size: var(--monigo-text-md); }
  ul { list-style: none; margin: 0; padding: 0; }
  .line, .tx { display: flex; justify-content: space-between; padding: var(--monigo-space-2) 0; border-bottom: 1px solid var(--monigo-color-border); font-size: var(--monigo-text-sm); }
</style>
