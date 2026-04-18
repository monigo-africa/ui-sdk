<script lang="ts">
  import SubscriptionList from '../components/SubscriptionList.svelte'
  import { getMonigoContext } from '../provider/context'
  import type { PortalSubscription } from '@monigo/portal-core'

  interface Props {
    oncancel?: (sub: PortalSubscription) => void
    class?: string
  }
  const { oncancel, class: className = '' }: Props = $props()
  const { messages } = getMonigoContext()
</script>

<section class="page {className}">
  <h1>{messages['subscriptions.title']}</h1>
  {#if oncancel}
    <SubscriptionList {oncancel} />
  {:else}
    <SubscriptionList />
  {/if}
</section>

<style>
  h1 { font-size: var(--monigo-text-2xl); margin-bottom: var(--monigo-space-5); }
</style>
