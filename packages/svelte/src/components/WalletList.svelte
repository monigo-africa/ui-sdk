<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { getMonigoContext } from '../provider/context'
  import { createWalletsRune } from '../stores/wallets.svelte'
  import type { PortalWallet } from '@monigo/portal-core'
  import WalletCard from './WalletCard.svelte'
  import Skeleton from './shared/Skeleton.svelte'
  import EmptyState from './shared/EmptyState.svelte'
  import ErrorState from './shared/ErrorState.svelte'

  interface Props {
    onWalletClick?: (wallet: PortalWallet) => void
    class?: string
  }
  const { onWalletClick, class: className = '' }: Props = $props()

  const { client, messages } = getMonigoContext()
  const rune = createWalletsRune(client)

  onMount(() => { rune.dispatch({ type: 'load' }) })
  onDestroy(() => { rune.dispose() })
</script>

<div class="wallet-list {className}">
  {#if rune.state.status === 'idle' || rune.state.status === 'loading'}
    <Skeleton rows={3} />
  {:else if rune.state.status === 'error'}
    <ErrorState error={rune.state.error} onRetry={() => rune.dispatch({ type: 'refresh' })} retryLabel={messages['common.retry']} />
  {:else if rune.state.wallets.length === 0}
    <EmptyState message={messages['wallets.empty']} />
  {:else}
    {#each rune.state.wallets as wallet (wallet.id)}
      {#if onWalletClick}
        <WalletCard {wallet} onClick={onWalletClick} />
      {:else}
        <WalletCard {wallet} />
      {/if}
    {/each}
  {/if}
</div>
