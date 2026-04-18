<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { getMonigoContext } from '../provider/context'
  import { createInvoicesRune } from '../stores/invoices.svelte'
  import { formatCurrency, formatDate, type PortalInvoice } from '@monigo/portal-core'
  import InvoiceStatusBadge from './InvoiceStatusBadge.svelte'
  import Skeleton from './shared/Skeleton.svelte'
  import EmptyState from './shared/EmptyState.svelte'
  import ErrorState from './shared/ErrorState.svelte'

  interface Props {
    limit?: number
    page?: number
    onInvoiceClick?: (invoice: PortalInvoice) => void
    class?: string
  }

  const { limit = 20, page = 1, onInvoiceClick, class: className = '' }: Props = $props()

  const { client, messages, locale } = getMonigoContext()
  const rune = createInvoicesRune(client)

  onMount(() => { rune.dispatch({ type: 'load', page, limit }) })
  onDestroy(() => { rune.dispose() })
</script>

<div class="invoice-list {className}">
  {#if rune.state.status === 'idle' || rune.state.status === 'loading'}
    <Skeleton rows={5} />
  {:else if rune.state.status === 'error'}
    <ErrorState error={rune.state.error} onRetry={() => rune.dispatch({ type: 'refresh' })} retryLabel={messages['common.retry']} />
  {:else if rune.state.invoices.length === 0}
    <EmptyState message={messages['invoices.empty']} />
  {:else}
    <table>
      <thead>
        <tr>
          <th>{messages['invoices.column.number']}</th>
          <th>{messages['invoices.column.date']}</th>
          <th>{messages['invoices.column.amount']}</th>
          <th>{messages['invoices.column.status']}</th>
        </tr>
      </thead>
      <tbody>
        {#each rune.state.invoices as invoice (invoice.id)}
          <tr class="row" onclick={() => onInvoiceClick?.(invoice)} onkeydown={(e) => e.key === 'Enter' && onInvoiceClick?.(invoice)} tabindex={onInvoiceClick ? 0 : -1} role={onInvoiceClick ? 'button' : undefined}>
            <td>{invoice.id}</td>
            <td>{formatDate(invoice.created_at, locale)}</td>
            <td>{formatCurrency(invoice.total, invoice.currency, locale)}</td>
            <td><InvoiceStatusBadge status={invoice.status} /></td>
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
