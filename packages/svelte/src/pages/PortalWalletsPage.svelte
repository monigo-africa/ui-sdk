<script lang="ts">
  import WalletList from '../components/WalletList.svelte'
  import { getMonigoContext } from '../provider/context'
  import type { PortalWallet } from '@monigo/portal-core'

  interface Props {
    onWalletClick?: (w: PortalWallet) => void
    class?: string
  }
  const { onWalletClick, class: className = '' }: Props = $props()
  const { messages } = getMonigoContext()
</script>

<section class="page {className}">
  <h1>{messages['wallets.title']}</h1>
  {#if onWalletClick}
    <WalletList {onWalletClick} />
  {:else}
    <WalletList />
  {/if}
</section>

<style>
  h1 { font-size: var(--monigo-text-2xl); margin-bottom: var(--monigo-space-5); }
</style>
