<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { getMonigoContext } from '../provider/context'
  import { createBillsRune } from '../stores/bills.svelte'
  import { formatCurrency, formatDate, type Bill } from '@monigo/portal-core'
  import BillStatusBadge from './BillStatusBadge.svelte'
  import Skeleton from './shared/Skeleton.svelte'
  import EmptyState from './shared/EmptyState.svelte'
  import ErrorState from './shared/ErrorState.svelte'

  interface Props {
    limit?: number
    page?: number
    onBillClick?: (bill: Bill) => void
    class?: string
  }

  const { limit = 20, page = 1, onBillClick, class: className = '' }: Props = $props()

  const { client, messages, locale } = getMonigoContext()
  const rune = createBillsRune(client)

  onMount(() => { rune.dispatch({ type: 'load', page, limit }) })
  onDestroy(() => { rune.dispose() })
</script>

<div class="bill-list {className}">
  {#if rune.state.status === 'idle' || rune.state.status === 'loading'}
    <Skeleton rows={5} />
  {:else if rune.state.status === 'error'}
    <ErrorState error={rune.state.error} onRetry={() => rune.dispatch({ type: 'refresh' })} retryLabel={messages['common.retry']} />
  {:else if rune.state.bills.length === 0}
    <EmptyState message={messages['bills.empty']} />
  {:else}
    <table>
      <thead>
        <tr>
          <th>Bill #</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {#each rune.state.bills as bill (bill.id)}
          <tr class="row" onclick={() => onBillClick?.(bill)} onkeydown={(e) => e.key === 'Enter' && onBillClick?.(bill)} tabindex={onBillClick ? 0 : -1} role={onBillClick ? 'button' : undefined}>
            <td>{bill.number}</td>
            <td>{formatDate(bill.issued_at, locale)}</td>
            <td>{formatCurrency(bill.total, bill.currency, locale)}</td>
            <td><BillStatusBadge status={bill.status} /></td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>

<style>
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: var(--monigo-space-3); text-align: left; font-size: var(--monigo-text-sm); border-bottom: 1px solid var(--monigo-color-border); }
  th { color: var(--monigo-color-muted-fg); font-weight: 500; }
  .row { cursor: pointer; }
  .row:hover { background: var(--monigo-color-muted); }
  .row:focus-visible { outline: 2px solid var(--monigo-color-primary); outline-offset: -2px; }
</style>
