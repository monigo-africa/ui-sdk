<script lang="ts">
  import InvoiceList from '../components/InvoiceList.svelte'
  import { getMonigoContext } from '../provider/context'
  import type { PortalInvoice } from '@monigo/portal-core'

  interface Props {
    onInvoiceClick?: (i: PortalInvoice) => void
    class?: string
  }
  const { onInvoiceClick, class: className = '' }: Props = $props()
  const { messages } = getMonigoContext()
</script>

<section class="page {className}">
  <h1>{messages['invoices.title']}</h1>
  {#if onInvoiceClick}
    <InvoiceList {onInvoiceClick} />
  {:else}
    <InvoiceList />
  {/if}
</section>

<style>
  h1 { font-size: var(--monigo-text-2xl); margin-bottom: var(--monigo-space-5); }
</style>
