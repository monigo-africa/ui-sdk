<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { getMonigoContext } from '../provider/context'
  import { createPayoutAccountsRune } from '../stores/payout-accounts.svelte'
  import PayoutAccountCard from './PayoutAccountCard.svelte'
  import Skeleton from './shared/Skeleton.svelte'
  import EmptyState from './shared/EmptyState.svelte'
  import ErrorState from './shared/ErrorState.svelte'

  interface Props {
    class?: string
  }
  const { class: className = '' }: Props = $props()

  const { client, messages } = getMonigoContext()
  const rune = createPayoutAccountsRune(client)

  onMount(() => { rune.dispatch({ type: 'load' }) })
  onDestroy(() => { rune.dispose() })
</script>

<div class="pa-list {className}">
  {#if rune.state.status === 'idle' || rune.state.status === 'loading'}
    <Skeleton rows={3} />
  {:else if rune.state.status === 'error'}
    <ErrorState error={rune.state.error} onRetry={() => rune.dispatch({ type: 'refresh' })} retryLabel={messages['common.retry']} />
  {:else if rune.state.payoutAccounts.length === 0}
    <EmptyState message={messages['payout_accounts.empty']} />
  {:else}
    {#each rune.state.payoutAccounts as account (account.id)}
      <PayoutAccountCard {account} />
    {/each}
  {/if}
</div>

<style>
  .pa-list { display: flex; flex-direction: column; }
</style>
