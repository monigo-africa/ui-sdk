<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { getMonigoContext } from '../provider/context'
  import { createPaymentMethodsRune } from '../stores/payment-methods.svelte'
  import PaymentMethodCard from './PaymentMethodCard.svelte'
  import AddPaymentMethodButton from './AddPaymentMethodButton.svelte'
  import Skeleton from './shared/Skeleton.svelte'
  import EmptyState from './shared/EmptyState.svelte'
  import ErrorState from './shared/ErrorState.svelte'

  interface Props {
    onRemove?: (id: string) => void
    onSetDefault?: (id: string) => void
    onAdd?: () => void
    class?: string
  }
  const { onRemove, onSetDefault, onAdd, class: className = '' }: Props = $props()

  const { client, messages } = getMonigoContext()
  const rune = createPaymentMethodsRune(client)

  onMount(() => { rune.dispatch({ type: 'load' }) })
  onDestroy(() => { rune.dispose() })

  const handleRemove = (id: string) => {
    onRemove?.(id)
    rune.dispatch({ type: 'refresh' })
  }

  const handleSetDefault = (id: string) => {
    onSetDefault?.(id)
    rune.dispatch({ type: 'refresh' })
  }
</script>

<div class="pm-list {className}">
  {#if onAdd}
    <div class="add-row">
      <AddPaymentMethodButton onadd={onAdd} />
    </div>
  {/if}

  {#if rune.state.status === 'idle' || rune.state.status === 'loading'}
    <Skeleton rows={3} />
  {:else if rune.state.status === 'error'}
    <ErrorState error={rune.state.error} onRetry={() => rune.dispatch({ type: 'refresh' })} retryLabel={messages['common.retry']} />
  {:else if rune.state.paymentMethods.length === 0}
    <EmptyState message={messages['payment_methods.empty']} />
  {:else}
    {#each rune.state.paymentMethods as method (method.id)}
      {#if onRemove && onSetDefault}
        <PaymentMethodCard {method} onRemove={handleRemove} onSetDefault={handleSetDefault} />
      {:else if onRemove}
        <PaymentMethodCard {method} onRemove={handleRemove} />
      {:else if onSetDefault}
        <PaymentMethodCard {method} onSetDefault={handleSetDefault} />
      {:else}
        <PaymentMethodCard {method} />
      {/if}
    {/each}
  {/if}
</div>

<style>
  .pm-list { display: flex; flex-direction: column; }
  .add-row { margin-bottom: var(--monigo-space-4); }
</style>
