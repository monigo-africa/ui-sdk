<script lang="ts">
  import BillList from '../components/BillList.svelte'
  import { getMonigoContext } from '../provider/context'
  import type { Bill } from '@monigo/portal-core'

  interface Props {
    onBillClick?: (b: Bill) => void
    class?: string
  }
  const { onBillClick, class: className = '' }: Props = $props()
  const { messages } = getMonigoContext()
</script>

<section class="page {className}">
  <h1>{messages['bills.title']}</h1>
  {#if onBillClick}
    <BillList {onBillClick} />
  {:else}
    <BillList />
  {/if}
</section>

<style>
  h1 { font-size: var(--monigo-text-2xl); margin-bottom: var(--monigo-space-5); }
</style>
