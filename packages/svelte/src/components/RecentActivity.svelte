<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { getMonigoContext } from '../provider/context'
  import { createDashboardRune } from '../stores/dashboard.svelte'
  import { formatCurrency, formatDate, type PortalInvoice, type Bill } from '@monigo/portal-core'
  import InvoiceStatusBadge from './InvoiceStatusBadge.svelte'
  import BillStatusBadge from './BillStatusBadge.svelte'
  import Skeleton from './shared/Skeleton.svelte'
  import ErrorState from './shared/ErrorState.svelte'

  interface Props {
    onInvoiceClick?: (i: PortalInvoice) => void
    onBillClick?: (b: Bill) => void
    class?: string
  }

  const { onInvoiceClick, onBillClick, class: className = '' }: Props = $props()

  const { client, messages, locale } = getMonigoContext()
  const rune = createDashboardRune(client)

  onMount(() => { rune.dispatch({ type: 'load' }) })
  onDestroy(() => { rune.dispose() })

  const snapshot = $derived(
    rune.state.status === 'ready' || rune.state.status === 'error' || rune.state.status === 'loading'
      ? ('snapshot' in rune.state ? rune.state.snapshot : undefined)
      : undefined
  )

  const recentInvoices = $derived(snapshot ? snapshot.invoices.slice(0, 5) : [])
  const recentBills = $derived(snapshot ? snapshot.bills.slice(0, 5) : [])
</script>

<div class="recent-activity {className}">
  {#if rune.state.status === 'idle' || (rune.state.status === 'loading' && !snapshot)}
    <Skeleton rows={6} />
  {:else if rune.state.status === 'error' && !snapshot}
    <ErrorState
      error={rune.state.error}
      onRetry={() => rune.dispatch({ type: 'refresh' })}
      retryLabel={messages['common.retry']}
    />
  {:else if snapshot}
    <div class="sections">
      <!-- Recent invoices -->
      <div class="section">
        <h3 class="section-heading">{messages['dashboard.recent_invoices']}</h3>
        {#if recentInvoices.length === 0}
          <p class="empty">No invoices yet.</p>
        {:else}
          <ul class="activity-list">
            {#each recentInvoices as invoice (invoice.id)}
              <li>
                {#if onInvoiceClick}
                  <button type="button" class="activity-row clickable" onclick={() => onInvoiceClick(invoice)}>
                    <div class="row-left">
                      <span class="row-date">{formatDate(invoice.created_at, locale)}</span>
                      <InvoiceStatusBadge status={invoice.status} />
                    </div>
                    <span class="row-amount">{formatCurrency(invoice.total, invoice.currency, locale)}</span>
                  </button>
                {:else}
                  <div class="activity-row">
                    <div class="row-left">
                      <span class="row-date">{formatDate(invoice.created_at, locale)}</span>
                      <InvoiceStatusBadge status={invoice.status} />
                    </div>
                    <span class="row-amount">{formatCurrency(invoice.total, invoice.currency, locale)}</span>
                  </div>
                {/if}
              </li>
            {/each}
          </ul>
        {/if}
      </div>

      <!-- Recent payouts -->
      <div class="section">
        <h3 class="section-heading">{messages['dashboard.recent_payouts']}</h3>
        {#if recentBills.length === 0}
          <p class="empty">No payouts yet.</p>
        {:else}
          <ul class="activity-list">
            {#each recentBills as bill (bill.id)}
              <li>
                {#if onBillClick}
                  <button type="button" class="activity-row clickable" onclick={() => onBillClick(bill)}>
                    <div class="row-left">
                      <span class="row-date">{formatDate(bill.issued_at, locale)}</span>
                      <BillStatusBadge status={bill.status} />
                    </div>
                    <span class="row-amount">{formatCurrency(bill.total, bill.currency, locale)}</span>
                  </button>
                {:else}
                  <div class="activity-row">
                    <div class="row-left">
                      <span class="row-date">{formatDate(bill.issued_at, locale)}</span>
                      <BillStatusBadge status={bill.status} />
                    </div>
                    <span class="row-amount">{formatCurrency(bill.total, bill.currency, locale)}</span>
                  </div>
                {/if}
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .sections {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--monigo-space-6);
  }

  .section-heading {
    font-size: var(--monigo-text-sm);
    font-weight: 600;
    color: var(--monigo-color-fg);
    margin: 0 0 var(--monigo-space-3);
  }

  .empty {
    font-size: var(--monigo-text-sm);
    color: var(--monigo-color-muted-fg);
  }

  .activity-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--monigo-space-2);
  }

  .activity-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--monigo-space-3);
    border: 1px solid var(--monigo-color-border);
    border-radius: var(--monigo-radius-md);
    font-size: var(--monigo-text-sm);
  }

  .activity-row.clickable {
    cursor: pointer;
    /* reset <button> browser defaults */
    background: none;
    font: inherit;
    color: inherit;
    text-align: left;
    width: 100%;
  }

  .activity-row.clickable:hover {
    background: var(--monigo-color-muted);
  }

  .activity-row:focus-visible {
    outline: 2px solid var(--monigo-color-primary);
    outline-offset: -2px;
  }

  .row-left {
    display: flex;
    flex-direction: column;
    gap: var(--monigo-space-1);
  }

  .row-date {
    color: var(--monigo-color-muted-fg);
    font-size: var(--monigo-text-xs);
  }

  .row-amount {
    font-weight: 600;
    color: var(--monigo-color-fg);
  }
</style>
