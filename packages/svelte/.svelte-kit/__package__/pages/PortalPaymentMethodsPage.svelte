<script lang="ts">
  import PaymentMethodList from '../components/PaymentMethodList.svelte'
  import { getMonigoContext } from '../provider/context'

  interface Props {
    onAdd?: () => void
    class?: string
  }
  const { onAdd, class: className = '' }: Props = $props()
  const { messages } = getMonigoContext()
</script>

<section class="page {className}">
  <h1>{messages['payment_methods.title']}</h1>
  {#if onAdd}
    <PaymentMethodList {onAdd} />
  {:else}
    <PaymentMethodList />
  {/if}
</section>

<style>
  h1 { font-size: var(--monigo-text-2xl); margin-bottom: var(--monigo-space-5); }
</style>
