<script lang="ts">
  import type { CustomerPaymentMethod } from '@monigo/portal-core'
  import RemovePaymentMethodButton from './RemovePaymentMethodButton.svelte'
  import SetDefaultPaymentMethodButton from './SetDefaultPaymentMethodButton.svelte'

  interface Props {
    method: CustomerPaymentMethod
    class?: string
    onRemove?: (id: string) => void
    onSetDefault?: (id: string) => void
  }
  const { method, class: className = '', onRemove, onSetDefault }: Props = $props()

  const title = $derived(
    method.type === 'card' && method.brand && method.last4
      ? `${method.brand} \u2022\u2022\u2022\u2022 ${method.last4}`
      : method.type === 'bank_account'
        ? 'Bank Account'
        : method.type === 'mobile_money'
          ? 'Mobile Money'
          : 'Payment Method',
  )

  const expiry = $derived(
    method.type === 'card' && method.exp_month != null && method.exp_year != null
      ? `Expires ${String(method.exp_month).padStart(2, '0')}/${method.exp_year}`
      : null,
  )
</script>

<article class="pm-card {className}">
  <div class="head">
    <div class="info">
      <span class="title">{title}</span>
      {#if method.is_default}
        <span class="badge-default">Default</span>
      {/if}
    </div>
    {#if expiry}
      <p class="expiry">{expiry}</p>
    {/if}
  </div>

  {#if onRemove || (onSetDefault && !method.is_default)}
    <div class="actions">
      {#if onSetDefault && !method.is_default}
        <SetDefaultPaymentMethodButton
          paymentMethodId={method.id}
          onsuccess={() => onSetDefault(method.id)}
        />
      {/if}
      {#if onRemove}
        <RemovePaymentMethodButton
          paymentMethodId={method.id}
          onsuccess={() => onRemove(method.id)}
        />
      {/if}
    </div>
  {/if}
</article>

<style>
  .pm-card {
    padding: var(--monigo-space-4) var(--monigo-space-5);
    border: 1px solid var(--monigo-color-border);
    border-radius: var(--monigo-radius-lg);
    background: var(--monigo-color-bg);
    margin-bottom: var(--monigo-space-3);
  }
  .head { display: flex; flex-direction: column; gap: var(--monigo-space-1); }
  .info { display: flex; align-items: center; gap: var(--monigo-space-2); flex-wrap: wrap; }
  .title { font-size: var(--monigo-text-base); font-weight: 600; }
  .badge-default {
    font-size: var(--monigo-text-xs);
    font-weight: 500;
    padding: 0.1em var(--monigo-space-2);
    border-radius: 9999px;
    background: color-mix(in srgb, var(--monigo-color-primary) 12%, transparent);
    color: var(--monigo-color-primary);
  }
  .expiry { margin: 0; font-size: var(--monigo-text-sm); color: var(--monigo-color-muted-fg); }
  .actions { display: flex; gap: var(--monigo-space-2); margin-top: var(--monigo-space-4); flex-wrap: wrap; }
</style>
