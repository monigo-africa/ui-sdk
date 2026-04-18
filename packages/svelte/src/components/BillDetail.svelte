<script lang="ts">
  import { onMount } from 'svelte'
  import { getMonigoContext } from '../provider/context'
  import { formatCurrency, formatDate, type Bill, type PayoutTransaction } from '@monigo/portal-core'
  import BillStatusBadge from './BillStatusBadge.svelte'
  import Skeleton from './shared/Skeleton.svelte'
  import ErrorState from './shared/ErrorState.svelte'

  interface Props { billId: string; class?: string }
  const { billId, class: className = '' }: Props = $props()
  const { client, locale, messages } = getMonigoContext()

  type DetailState =
    | { status: 'loading' }
    | { status: 'ready'; bill: Bill; transactions: PayoutTransaction[] }
    | { status: 'error'; error: Error }

  let state = $state<DetailState>({ status: 'loading' })

  async function load() {
    state = { status: 'loading' }
    try {
      const [{ bill }, txRes] = await Promise.all([
        client.getBill(billId),
        client.getBillTransactions(billId).catch(() => ({ transactions: [] as PayoutTransaction[] })),
      ])
      state = { status: 'ready', bill, transactions: txRes.transactions }
    } catch (err) {
      state = { status: 'error', error: err instanceof Error ? err : new Error(String(err)) }
    }
  }

  onMount(load)
</script>

<article class="bill-detail {className}">
  {#if state.status === 'loading'}
    <Skeleton rows={6} />
  {:else if state.status === 'error'}
    <ErrorState error={state.error} onRetry={load} retryLabel={messages['common.retry']} />
  {:else}
    <header class="head">
      <div>
        <h2>{state.bill.number}</h2>
        <p class="muted">{formatDate(state.bill.issued_at, locale)}</p>
      </div>
      <div class="right">
        <p class="amount">{formatCurrency(state.bill.total, state.bill.currency, locale)}</p>
        <BillStatusBadge status={state.bill.status} />
      </div>
    </header>

    {#if state.bill.line_items?.length}
      <section class="lines">
        <h3>Line items</h3>
        <ul>
          {#each state.bill.line_items as raw, i (i)}
            {@const line = raw as { description?: string; name?: string; amount?: string; total?: string }}
            <li class="line">
              <span>{line.description ?? line.name ?? 'Item'}</span>
              <span>{formatCurrency(line.amount ?? line.total ?? '0', state.bill.currency, locale)}</span>
            </li>
          {/each}
        </ul>
      </section>
    {/if}

    {#if state.transactions.length}
      <section class="transactions">
        <h3>Payout history</h3>
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
