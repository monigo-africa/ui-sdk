<script lang="ts">
  import PayoutAccountList from '../components/PayoutAccountList.svelte'
  import { getMonigoContext } from '../provider/context'

  interface Props {
    class?: string
  }
  const { class: className = '' }: Props = $props()
  const { messages } = getMonigoContext()
</script>

<section class="page {className}">
  <h1>{messages['payout_accounts.title']}</h1>
  <PayoutAccountList />
</section>

<style>
  h1 { font-size: var(--monigo-text-2xl); margin-bottom: var(--monigo-space-5); }
</style>
