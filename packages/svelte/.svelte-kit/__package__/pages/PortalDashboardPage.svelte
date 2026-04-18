<script lang="ts">
  import DashboardSummary from '../components/DashboardSummary.svelte'
  import RecentActivity from '../components/RecentActivity.svelte'
  import type { PortalInvoice, Bill } from '@monigo/portal-core'

  interface Props {
    onInvoiceClick?: (i: PortalInvoice) => void
    onBillClick?: (b: Bill) => void
    class?: string
  }
  const { onInvoiceClick, onBillClick, class: className = '' }: Props = $props()
</script>

<section class="portal-dashboard {className}">
  <DashboardSummary />
  {#if onInvoiceClick && onBillClick}
    <RecentActivity {onInvoiceClick} {onBillClick} />
  {:else if onInvoiceClick}
    <RecentActivity {onInvoiceClick} />
  {:else if onBillClick}
    <RecentActivity {onBillClick} />
  {:else}
    <RecentActivity />
  {/if}
</section>
