<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { getMonigoContext } from '../provider/context'
  import { createDashboardRune } from '../stores/dashboard.svelte'
  import { formatCurrency } from '@monigo/portal-core'
  import Skeleton from './shared/Skeleton.svelte'
  import ErrorState from './shared/ErrorState.svelte'

  // NOTE: DashboardSummary and RecentActivity each create their own DashboardRune instance,
  // resulting in two API round-trips when both are used on the same page. This is intentional
  // for v1 simplicity — consolidate via Svelte context in a future iteration.

  interface Props {
    class?: string
  }

  const { class: className = '' }: Props = $props()

  const { client, messages, locale } = getMonigoContext()
  const rune = createDashboardRune(client)

  onMount(() => { rune.dispatch({ type: 'load' }) })
  onDestroy(() => { rune.dispose() })

  const snapshot = $derived(
    rune.state.status === 'ready' || rune.state.status === 'error' || rune.state.status === 'loading'
      ? ('snapshot' in rune.state ? rune.state.snapshot : undefined)
      : undefined
  )

  // Outstanding invoices: sum of `total` for finalized invoices (approximation of unpaid).
  const outstanding = $derived(
    snapshot
      ? snapshot.invoices
          .filter((i) => i.status === 'finalized')
          .reduce((sum, i) => sum + parseFloat(i.total), 0)
      : 0
  )
  const invoiceCurrency = $derived(snapshot?.invoices[0]?.currency ?? 'NGN')

  // Wallet balance: sum of balance for active wallets.
  const activeWallets = $derived(
    snapshot ? snapshot.wallets.filter((w) => w.status === 'active') : []
  )
  const totalWalletBalance = $derived(
    activeWallets.reduce((sum, w) => sum + parseFloat(w.balance), 0)
  )
  const walletCurrency = $derived(activeWallets[0]?.currency ?? 'NGN')

  // Active subscriptions: count where status is not 'canceled'.
  const activeSubCount = $derived(
    snapshot
      ? snapshot.subscriptions.filter((s) => (s.status as string) !== 'canceled').length
      : 0
  )
</script>

<div class="dashboard-summary {className}">
  {#if rune.state.status === 'idle' || (rune.state.status === 'loading' && !snapshot)}
    <Skeleton rows={3} />
  {:else if rune.state.status === 'error' && !snapshot}
    <ErrorState
      error={rune.state.error}
      onRetry={() => rune.dispatch({ type: 'refresh' })}
      retryLabel={messages['common.retry']}
    />
  {:else if snapshot}
    <div class="cards">
      <!-- Outstanding invoices -->
      <div class="card">
        <p class="card-label">{messages['dashboard.outstanding']}</p>
        <p class="card-value">{formatCurrency(outstanding, invoiceCurrency, locale)}</p>
        <p class="card-sub">Awaiting payment</p>
      </div>

      <!-- Wallet balance (only shown when there are active wallets) -->
      {#if activeWallets.length > 0}
        <div class="card">
          <p class="card-label">{messages['dashboard.wallet_balance']}</p>
          <p class="card-value">{formatCurrency(totalWalletBalance, walletCurrency, locale)}</p>
          <p class="card-sub">Available</p>
        </div>
      {/if}

      <!-- Active subscriptions -->
      <div class="card">
        <p class="card-label">Active subscriptions</p>
        <p class="card-value card-value--count">{activeSubCount}</p>
        <p class="card-sub">{activeSubCount === 1 ? 'plan' : 'plans'}</p>
      </div>
    </div>
  {/if}
</div>

<style>
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: var(--monigo-space-4);
  }

  .card {
    padding: var(--monigo-space-4);
    border: 1px solid var(--monigo-color-border);
    border-radius: var(--monigo-radius-md);
    background: var(--monigo-color-surface, var(--monigo-color-muted));
  }

  .card-label {
    font-size: var(--monigo-text-xs);
    color: var(--monigo-color-muted-fg);
    margin: 0 0 var(--monigo-space-2);
  }

  .card-value {
    font-size: var(--monigo-text-xl, 1.25rem);
    font-weight: 700;
    color: var(--monigo-color-fg);
    margin: 0 0 var(--monigo-space-1);
  }

  .card-value--count {
    color: var(--monigo-color-primary);
  }

  .card-sub {
    font-size: var(--monigo-text-xs);
    color: var(--monigo-color-muted-fg);
    margin: 0;
  }
</style>
