<script lang="ts">
  import { onMount } from 'svelte'
  import { formatCurrency, type PortalWallet } from '@monigo/portal-core'
  import { getMonigoContext } from '../provider/context'
  import WalletTransactionList from './WalletTransactionList.svelte'
  import FundWalletButton from './FundWalletButton.svelte'
  import Skeleton from './shared/Skeleton.svelte'
  import ErrorState from './shared/ErrorState.svelte'

  interface Props { walletId: string; class?: string }
  const { walletId, class: className = '' }: Props = $props()
  const { client, locale, messages } = getMonigoContext()

  type WalletViewState =
    | { status: 'loading' }
    | { status: 'ready'; wallet: PortalWallet }
    | { status: 'error'; error: Error }

  let viewState: WalletViewState = $state({ status: 'loading' })

  async function load() {
    viewState = { status: 'loading' }
    try {
      const { wallet } = await client.getWallet(walletId)
      viewState = { status: 'ready', wallet }
    } catch (err) {
      viewState = { status: 'error', error: err instanceof Error ? err : new Error(String(err)) }
    }
  }

  onMount(load)
</script>

<article class="wallet-detail {className}">
  {#if viewState.status === 'loading'}
    <Skeleton rows={6} />
  {:else if viewState.status === 'error'}
    <ErrorState error={viewState.error} onRetry={load} retryLabel={messages['common.retry']} />
  {:else}
    <header class="head">
      <div>
        <h2>{viewState.wallet.currency} wallet</h2>
        <p class="muted">Status: {viewState.wallet.status}</p>
      </div>
      <p class="balance">{formatCurrency(viewState.wallet.balance, viewState.wallet.currency, locale)}</p>
    </header>

    {#if viewState.wallet.virtual_accounts && viewState.wallet.virtual_accounts.length > 0}
      <section class="vas">
        <h3>Virtual accounts</h3>
        <ul>
          {#each viewState.wallet.virtual_accounts as va (va.id)}
            <li>
              <span class="va-provider">{va.provider}</span>
              <span class="va-number">{va.account_number}</span>
              {#if va.bank_name}<span class="va-bank">{va.bank_name}</span>{/if}
            </li>
          {/each}
        </ul>
      </section>
    {/if}

    {#if viewState.wallet.status === 'active'}
      <section class="actions">
        <FundWalletButton walletId={viewState.wallet.id} currency={viewState.wallet.currency} />
      </section>
    {/if}

    <section class="tx">
      <h3>Transactions</h3>
      <WalletTransactionList walletId={viewState.wallet.id} />
    </section>
  {/if}
</article>

<style>
  .head { display: flex; justify-content: space-between; align-items: flex-start; padding: var(--monigo-space-6) 0; border-bottom: 1px solid var(--monigo-color-border); }
  .muted { color: var(--monigo-color-muted-fg); font-size: var(--monigo-text-sm); }
  .balance { font-size: var(--monigo-text-2xl); font-weight: 700; margin: 0; }
  h2 { margin: 0 0 var(--monigo-space-1) 0; font-size: var(--monigo-text-xl); }
  h3 { margin: 0 0 var(--monigo-space-3) 0; font-size: var(--monigo-text-md); }
  section { padding: var(--monigo-space-5) 0; }
  ul { list-style: none; margin: 0; padding: 0; }
  ul li { display: flex; gap: var(--monigo-space-3); padding: var(--monigo-space-2) 0; border-bottom: 1px solid var(--monigo-color-border); font-size: var(--monigo-text-sm); }
  .va-provider { color: var(--monigo-color-muted-fg); text-transform: uppercase; font-size: var(--monigo-text-xs); min-width: 80px; }
</style>
