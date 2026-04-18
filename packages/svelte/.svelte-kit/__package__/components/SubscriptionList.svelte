<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { getMonigoContext } from '../provider/context'
  import { createSubscriptionsRune } from '../stores/subscriptions.svelte'
  import type { PortalSubscription } from '@monigo/portal-core'
  import SubscriptionCard from './SubscriptionCard.svelte'
  import Skeleton from './shared/Skeleton.svelte'
  import EmptyState from './shared/EmptyState.svelte'
  import ErrorState from './shared/ErrorState.svelte'

  interface Props {
    oncancel?: (sub: PortalSubscription) => void
    class?: string
  }
  const { oncancel, class: className = '' }: Props = $props()

  const { client, messages } = getMonigoContext()
  const rune = createSubscriptionsRune(client)

  onMount(() => { rune.dispatch({ type: 'load' }) })
  onDestroy(() => { rune.dispose() })
</script>

<div class="sub-list {className}">
  {#if rune.state.status === 'idle' || rune.state.status === 'loading'}
    <Skeleton rows={3} />
  {:else if rune.state.status === 'error'}
    <ErrorState error={rune.state.error} onRetry={() => rune.dispatch({ type: 'refresh' })} retryLabel={messages['common.retry']} />
  {:else if rune.state.subscriptions.length === 0}
    <EmptyState message={messages['subscriptions.empty']} />
  {:else}
    {#each rune.state.subscriptions as sub (sub.id)}
      {#if oncancel}
        <SubscriptionCard subscription={sub} oncancel={oncancel} />
      {:else}
        <SubscriptionCard subscription={sub} />
      {/if}
    {/each}
  {/if}
</div>
