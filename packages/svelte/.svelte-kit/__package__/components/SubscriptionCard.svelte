<script lang="ts">
  import { formatSubscriptionStatus, formatDate, type PortalSubscription } from '@monigo/portal-core'
  import { getMonigoContext } from '../provider/context'
  import CancelSubscriptionButton from './CancelSubscriptionButton.svelte'

  interface Props {
    subscription: PortalSubscription
    class?: string
    oncancel?: (sub: PortalSubscription) => void
  }
  const { subscription, class: className = '', oncancel }: Props = $props()
  const { locale } = getMonigoContext()

  const planLabel = $derived(subscription.plan_name ?? subscription.plan_id)
  const typeLabel = $derived(
    subscription.plan_type === 'collection' ? 'Collection' :
    subscription.plan_type === 'payout' ? 'Payout' :
    '',
  )
  const cancellable = $derived(
    (subscription.status as string) === 'active' || (subscription.status as string) === 'trial',
  )
</script>

<article class="sub-card {className}">
  <header class="head">
    <div>
      <h3 class="plan">{planLabel}</h3>
      {#if typeLabel}<span class="type">{typeLabel}</span>{/if}
    </div>
    <span class="status">{formatSubscriptionStatus(subscription.status)}</span>
  </header>

  {#if subscription.current_period_start && subscription.current_period_end}
    <p class="period">{formatDate(subscription.current_period_start, locale)} – {formatDate(subscription.current_period_end, locale)}</p>
  {/if}

  {#if oncancel && cancellable}
    <div class="actions">
      <CancelSubscriptionButton {subscription} {oncancel} />
    </div>
  {/if}
</article>

<style>
  .sub-card {
    padding: var(--monigo-space-5);
    border: 1px solid var(--monigo-color-border);
    border-radius: var(--monigo-radius-lg);
    background: var(--monigo-color-bg);
    margin-bottom: var(--monigo-space-3);
  }
  .head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--monigo-space-3); }
  .plan { margin: 0; font-size: var(--monigo-text-lg); font-weight: 600; }
  .type { font-size: var(--monigo-text-xs); color: var(--monigo-color-muted-fg); text-transform: uppercase; letter-spacing: 0.05em; }
  .status { font-size: var(--monigo-text-sm); color: var(--monigo-color-muted-fg); }
  .period { color: var(--monigo-color-muted-fg); font-size: var(--monigo-text-sm); margin: var(--monigo-space-2) 0; }
  .actions { margin-top: var(--monigo-space-4); }
</style>
