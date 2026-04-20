<script lang="ts">
  import { formatCurrency, type PortalWallet } from '@monigo/portal-core'
  import { getMonigoContext } from '../provider/context'

  interface Props {
    wallet: PortalWallet
    onClick?: (wallet: PortalWallet) => void
    class?: string
  }
  const { wallet, onClick, class: className = '' }: Props = $props()
  const { locale } = getMonigoContext()
</script>

{#snippet cardContent()}
  <div class="head">
    <span class="currency">{wallet.currency}</span>
    <span class="status">{wallet.status}</span>
  </div>
  <p class="balance">{formatCurrency(wallet.balance, wallet.currency, locale)}</p>
  {#if wallet.virtual_accounts && wallet.virtual_accounts.length > 0}
    <p class="va">{wallet.virtual_accounts.length} virtual account{wallet.virtual_accounts.length === 1 ? '' : 's'}</p>
  {/if}
{/snippet}

{#if onClick}
  <button type="button" class="wallet-card clickable {className}"
    onclick={() => onClick!(wallet)}
    onkeydown={(e) => e.key === 'Enter' && onClick!(wallet)}>
    {@render cardContent()}
  </button>
{:else}
  <article class="wallet-card {className}">
    {@render cardContent()}
  </article>
{/if}

<style>
  .wallet-card {
    padding: var(--monigo-space-5);
    border: 1px solid var(--monigo-color-border);
    border-radius: var(--monigo-radius-lg);
    background: var(--monigo-color-bg);
    margin-bottom: var(--monigo-space-3);
  }
  .wallet-card.clickable { cursor: pointer; width: 100%; text-align: left; font: inherit; }
  .wallet-card.clickable:hover { background: var(--monigo-color-muted); }
  .wallet-card.clickable:focus-visible { outline: 2px solid var(--monigo-color-primary); outline-offset: -2px; }
  .head { display: flex; justify-content: space-between; margin-bottom: var(--monigo-space-2); }
  .currency { font-weight: 600; font-size: var(--monigo-text-md); }
  .status { font-size: var(--monigo-text-xs); color: var(--monigo-color-muted-fg); text-transform: uppercase; }
  .balance { font-size: var(--monigo-text-2xl); font-weight: 700; margin: 0 0 var(--monigo-space-2) 0; }
  .va { color: var(--monigo-color-muted-fg); font-size: var(--monigo-text-sm); margin: 0; }
</style>
