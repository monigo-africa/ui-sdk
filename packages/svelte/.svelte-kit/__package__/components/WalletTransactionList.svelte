<script lang="ts">
  import { onMount } from 'svelte'
  import { formatCurrency, formatDate, type PortalLedgerEntry } from '@monigo/portal-core'
  import { getMonigoContext } from '../provider/context'
  import Skeleton from './shared/Skeleton.svelte'
  import EmptyState from './shared/EmptyState.svelte'
  import ErrorState from './shared/ErrorState.svelte'

  interface Props { walletId: string; limit?: number; class?: string }
  const { walletId, limit = 20, class: className = '' }: Props = $props()
  const { client, locale, messages } = getMonigoContext()

  type TxState =
    | { status: 'loading' }
    | { status: 'ready'; entries: PortalLedgerEntry[]; count: number; page: number }
    | { status: 'error'; error: Error }

  let viewState: TxState = $state({ status: 'loading' })
  let page = $state(1)

  async function load(p: number) {
    viewState = { status: 'loading' }
    try {
      const res = await client.getWalletTransactions(walletId, p, limit)
      viewState = { status: 'ready', entries: res.entries, count: res.count, page: p }
      page = p
    } catch (err) {
      viewState = { status: 'error', error: err instanceof Error ? err : new Error(String(err)) }
    }
  }

  onMount(() => load(1))

  const hasNext = $derived.by(() => viewState.status === 'ready' ? viewState.page * limit < viewState.count : false)
  const hasPrev = $derived.by(() => viewState.status === 'ready' ? viewState.page > 1 : false)
</script>

<section class="tx-list {className}">
  {#if viewState.status === 'loading'}
    <Skeleton rows={5} />
  {:else if viewState.status === 'error'}
    <ErrorState error={viewState.error} onRetry={() => load(page)} retryLabel={messages['common.retry']} />
  {:else if viewState.entries.length === 0}
    <EmptyState message="No transactions yet." />
  {:else}
    <table>
      <thead>
        <tr><th>Date</th><th>Description</th><th>Direction</th><th>Amount</th><th>Balance</th></tr>
      </thead>
      <tbody>
        {#each viewState.entries as entry (entry.id)}
          <tr>
            <td>{formatDate(entry.created_at, locale)}</td>
            <td>{entry.description ?? entry.entry_type}</td>
            <td>{entry.direction}</td>
            <td>{formatCurrency(entry.amount, entry.currency, locale)}</td>
            <td>{formatCurrency(entry.balance_after, entry.currency, locale)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
    <nav class="pager">
      <button type="button" onclick={() => load(page - 1)} disabled={!hasPrev}>Previous</button>
      <span>Page {page}</span>
      <button type="button" onclick={() => load(page + 1)} disabled={!hasNext}>Next</button>
    </nav>
  {/if}
</section>

<style>
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: var(--monigo-space-3); text-align: left; font-size: var(--monigo-text-sm); border-bottom: 1px solid var(--monigo-color-border); }
  th { color: var(--monigo-color-muted-fg); font-weight: 500; }
  .pager { display: flex; justify-content: space-between; align-items: center; padding: var(--monigo-space-3) 0; }
  .pager button { padding: var(--monigo-space-2) var(--monigo-space-3); background: transparent; border: 1px solid var(--monigo-color-border); border-radius: var(--monigo-radius-md); cursor: pointer; }
  .pager button:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
