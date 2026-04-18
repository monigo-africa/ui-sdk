<script lang="ts">
  import type { CustomerPayoutAccount } from '@monigo/portal-core'

  interface Props {
    account: CustomerPayoutAccount
    class?: string
  }
  const { account, class: className = '' }: Props = $props()

  const methodLabel = $derived(
    account.payout_method === 'bank_transfer' ? 'Bank transfer' :
    account.payout_method === 'mobile_money' ? 'Mobile money' :
    account.payout_method,
  )

  const maskedAccount = $derived(
    account.account_number
      ? `\u2022\u2022\u2022\u2022 ${account.account_number.slice(-4)}`
      : null,
  )

  const maskedMobile = $derived(
    account.mobile_money_number
      ? `\u2022\u2022\u2022\u2022 ${account.mobile_money_number.slice(-4)}`
      : null,
  )
</script>

<article class="pa-card {className}">
  <header class="head">
    <div class="info">
      <h3 class="name">{account.account_name}</h3>
      {#if account.is_default}
        <span class="badge-default">Default</span>
      {/if}
    </div>
    <span class="currency">{account.currency}</span>
  </header>

  <p class="method">{methodLabel}</p>

  {#if account.payout_method === 'bank_transfer'}
    {#if account.bank_name}
      <p class="detail">
        {account.bank_name}{maskedAccount ? ` \u00b7 ${maskedAccount}` : ''}
      </p>
    {:else if maskedAccount}
      <p class="detail">{maskedAccount}</p>
    {/if}
  {:else if maskedMobile}
    <p class="detail">{maskedMobile}</p>
  {/if}
</article>

<style>
  .pa-card {
    padding: var(--monigo-space-5);
    border: 1px solid var(--monigo-color-border);
    border-radius: var(--monigo-radius-lg);
    background: var(--monigo-color-bg);
    margin-bottom: var(--monigo-space-3);
  }
  .head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--monigo-space-2);
  }
  .info { display: flex; align-items: center; gap: var(--monigo-space-2); flex-wrap: wrap; }
  .name { margin: 0; font-size: var(--monigo-text-lg); font-weight: 600; }
  .badge-default {
    font-size: var(--monigo-text-xs);
    font-weight: 500;
    padding: 0.1em var(--monigo-space-2);
    border-radius: 9999px;
    background: color-mix(in srgb, var(--monigo-color-primary) 12%, transparent);
    color: var(--monigo-color-primary);
  }
  .currency {
    font-size: var(--monigo-text-xs);
    font-weight: 600;
    padding: 0.15em var(--monigo-space-2);
    border-radius: var(--monigo-radius-md);
    background: color-mix(in srgb, var(--monigo-color-muted-fg) 12%, transparent);
    color: var(--monigo-color-muted-fg);
    white-space: nowrap;
  }
  .method {
    margin: 0 0 var(--monigo-space-1);
    font-size: var(--monigo-text-sm);
    color: var(--monigo-color-muted-fg);
  }
  .detail {
    margin: 0;
    font-size: var(--monigo-text-sm);
    color: var(--monigo-color-muted-fg);
  }
</style>
