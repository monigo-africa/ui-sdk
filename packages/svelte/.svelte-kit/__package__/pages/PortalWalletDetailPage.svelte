<script lang="ts">
  import WalletDetail from '../components/WalletDetail.svelte'

  interface Props {
    walletId: string
    class?: string
  }
  const { walletId, class: className = '' }: Props = $props()
</script>

<section class="page {className}">
  <WalletDetail {walletId} />
</section>
