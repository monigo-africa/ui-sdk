<script lang="ts">
  import { onMount, onDestroy, untrack } from 'svelte'
  import { defineRoutes, matchRoute } from './router'
  import PortalDashboardPage from '../pages/PortalDashboardPage.svelte'
  import PortalInvoicesPage from '../pages/PortalInvoicesPage.svelte'
  import PortalInvoiceDetailPage from '../pages/PortalInvoiceDetailPage.svelte'
  import PortalBillsPage from '../pages/PortalBillsPage.svelte'
  import PortalBillDetailPage from '../pages/PortalBillDetailPage.svelte'
  import PortalSubscriptionsPage from '../pages/PortalSubscriptionsPage.svelte'
  import PortalWalletsPage from '../pages/PortalWalletsPage.svelte'
  import PortalWalletDetailPage from '../pages/PortalWalletDetailPage.svelte'
  import PortalPaymentMethodsPage from '../pages/PortalPaymentMethodsPage.svelte'
  import PortalPayoutAccountsPage from '../pages/PortalPayoutAccountsPage.svelte'
  import { getMonigoContext } from '../provider/context'

  interface Props {
    basePath?: string
    router?: 'path' | 'hash' | 'memory'
    initialPath?: string
    class?: string
  }
  const props: Props = $props()
  const basePath = $derived(props.basePath ?? '/')
  const router = $derived(props.router ?? 'path')
  const className = $derived(props.class ?? '')

  const routes = defineRoutes([
    { path: '/', name: 'dashboard' },
    { path: '/invoices', name: 'invoices' },
    { path: '/invoices/:id', name: 'invoice-detail' },
    { path: '/bills', name: 'bills' },
    { path: '/bills/:id', name: 'bill-detail' },
    { path: '/subscriptions', name: 'subscriptions' },
    { path: '/wallets', name: 'wallets' },
    { path: '/wallets/:id', name: 'wallet-detail' },
    { path: '/payment-methods', name: 'payment-methods' },
    { path: '/payout-accounts', name: 'payout-accounts' },
  ])

  const { messages } = getMonigoContext()

  // initialPath is an init-only prop: read once, untracked, so Svelte doesn't warn about
  // capturing a reactive value inside $state().
  const _initialPath = untrack(() => props.initialPath ?? '/')
  let currentPath = $state(_initialPath)

  function readPath(): string {
    if (typeof window === 'undefined') return _initialPath
    if (router === 'memory') return currentPath
    if (router === 'hash') return window.location.hash.slice(1) || '/'
    const full = window.location.pathname
    return full.startsWith(basePath) ? full.slice(basePath.length) || '/' : '/'
  }

  function navigate(path: string): void {
    if (router === 'memory') { currentPath = path; return }
    if (typeof window === 'undefined') return
    if (router === 'hash') { window.location.hash = path; return }
    const full = basePath.replace(/\/$/, '') + path
    history.pushState({}, '', full)
    currentPath = path
  }

  function onPopState() { currentPath = readPath() }

  onMount(() => {
    currentPath = readPath()
    if (router === 'path' || router === 'hash') window.addEventListener('popstate', onPopState)
  })
  onDestroy(() => {
    if (typeof window !== 'undefined' && (router === 'path' || router === 'hash')) {
      window.removeEventListener('popstate', onPopState)
    }
  })

  const match = $derived(matchRoute(routes, currentPath))
</script>

<nav class="tabs" aria-label="Portal navigation">
  <button type="button" onclick={() => navigate('/')}>{messages['nav.dashboard']}</button>
  <button type="button" onclick={() => navigate('/invoices')}>{messages['nav.invoices']}</button>
  <button type="button" onclick={() => navigate('/bills')}>{messages['nav.bills']}</button>
  <button type="button" onclick={() => navigate('/subscriptions')}>{messages['nav.subscriptions']}</button>
  <button type="button" onclick={() => navigate('/wallets')}>{messages['nav.wallets']}</button>
  <button type="button" onclick={() => navigate('/payment-methods')}>{messages['nav.payment_methods']}</button>
  <button type="button" onclick={() => navigate('/payout-accounts')}>{messages['nav.payout_accounts']}</button>
</nav>

<div class="portal {className}">
  {#if !match || match.name === 'dashboard'}
    <PortalDashboardPage onInvoiceClick={(i) => navigate('/invoices/' + i.id)} onBillClick={(b) => navigate('/bills/' + b.id)} />
  {:else if match.name === 'invoices'}
    <PortalInvoicesPage onInvoiceClick={(i) => navigate('/invoices/' + i.id)} />
  {:else if match.name === 'invoice-detail'}
    <PortalInvoiceDetailPage invoiceId={match.params.id as string} />
  {:else if match.name === 'bills'}
    <PortalBillsPage onBillClick={(b) => navigate('/bills/' + b.id)} />
  {:else if match.name === 'bill-detail'}
    <PortalBillDetailPage billId={match.params.id as string} />
  {:else if match.name === 'subscriptions'}
    <PortalSubscriptionsPage />
  {:else if match.name === 'wallets'}
    <PortalWalletsPage onWalletClick={(w) => navigate('/wallets/' + w.id)} />
  {:else if match.name === 'wallet-detail'}
    <PortalWalletDetailPage walletId={match.params.id as string} />
  {:else if match.name === 'payment-methods'}
    <PortalPaymentMethodsPage />
  {:else if match.name === 'payout-accounts'}
    <PortalPayoutAccountsPage />
  {/if}
</div>

<style>
  .tabs { display: flex; gap: var(--monigo-space-2); padding: var(--monigo-space-3) 0; border-bottom: 1px solid var(--monigo-color-border); margin-bottom: var(--monigo-space-5); }
  .tabs button { padding: var(--monigo-space-2) var(--monigo-space-3); background: transparent; border: none; color: var(--monigo-color-muted-fg); font-size: var(--monigo-text-sm); cursor: pointer; border-radius: var(--monigo-radius-sm); }
  .tabs button:hover { color: var(--monigo-color-fg); background: var(--monigo-color-muted); }
</style>
