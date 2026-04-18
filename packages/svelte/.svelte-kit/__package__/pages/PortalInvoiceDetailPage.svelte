<script lang="ts">
  import InvoiceDetail from '../components/InvoiceDetail.svelte'

  interface Props {
    invoiceId: string
    class?: string
  }
  const { invoiceId, class: className = '' }: Props = $props()
</script>

<section class="page {className}">
  <InvoiceDetail {invoiceId} />
</section>
