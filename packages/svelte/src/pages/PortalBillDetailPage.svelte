<script lang="ts">
  import BillDetail from '../components/BillDetail.svelte'

  interface Props {
    billId: string
    class?: string
  }
  const { billId, class: className = '' }: Props = $props()
</script>

<section class="page {className}">
  <BillDetail {billId} />
</section>
