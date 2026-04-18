<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { defineRoutes, matchRoute } from './router'
import { useMonigoContext } from '../provider/context'
import PortalDashboardPage from '../pages/PortalDashboardPage.vue'
import PortalInvoicesPage from '../pages/PortalInvoicesPage.vue'
import PortalInvoiceDetailPage from '../pages/PortalInvoiceDetailPage.vue'
import PortalBillsPage from '../pages/PortalBillsPage.vue'
import PortalBillDetailPage from '../pages/PortalBillDetailPage.vue'
import PortalSubscriptionsPage from '../pages/PortalSubscriptionsPage.vue'
import PortalWalletsPage from '../pages/PortalWalletsPage.vue'
import PortalWalletDetailPage from '../pages/PortalWalletDetailPage.vue'
import PortalPaymentMethodsPage from '../pages/PortalPaymentMethodsPage.vue'
import PortalPayoutAccountsPage from '../pages/PortalPayoutAccountsPage.vue'

interface Props {
  basePath?: string
  router?: 'path' | 'hash' | 'memory'
  initialPath?: string
  class?: string
}
const props = withDefaults(defineProps<Props>(), {
  basePath: '/',
  router: 'path',
  initialPath: '/',
  class: '',
})

const { messages } = useMonigoContext()

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

const readPath = (): string => {
  if (typeof window === 'undefined') return props.initialPath
  if (props.router === 'memory') return props.initialPath
  if (props.router === 'hash') return window.location.hash.slice(1) || '/'
  const full = window.location.pathname
  return full.startsWith(props.basePath) ? full.slice(props.basePath.length) || '/' : '/'
}

const currentPath = ref<string>(props.initialPath)

const navigate = (path: string) => {
  if (props.router === 'memory') { currentPath.value = path; return }
  if (typeof window === 'undefined') return
  if (props.router === 'hash') { window.location.hash = path; return }
  const full = props.basePath.replace(/\/$/, '') + path
  history.pushState({}, '', full)
  currentPath.value = path
}

const onPopState = () => { currentPath.value = readPath() }

onMounted(() => {
  currentPath.value = readPath()
  if (props.router === 'path' || props.router === 'hash') {
    window.addEventListener('popstate', onPopState)
  }
})

onUnmounted(() => {
  window.removeEventListener('popstate', onPopState)
})

const match = computed(() => matchRoute(routes, currentPath.value))

const navBtnStyle = {
  padding: 'var(--monigo-space-2) var(--monigo-space-3)',
  background: 'transparent',
  border: 'none',
  color: 'var(--monigo-color-muted-fg)',
  fontSize: 'var(--monigo-text-sm)',
  cursor: 'pointer',
  borderRadius: 'var(--monigo-radius-sm)',
}
</script>

<template>
  <div :class="['monigo-portal', props.class]">
    <nav
      aria-label="Portal navigation"
      :style="{ display: 'flex', gap: 'var(--monigo-space-2)', padding: 'var(--monigo-space-3) 0', borderBottom: '1px solid var(--monigo-color-border)', marginBottom: 'var(--monigo-space-5)' }"
    >
      <button type="button" :style="navBtnStyle" @click="navigate('/')">{{ messages['nav.dashboard'] }}</button>
      <button type="button" :style="navBtnStyle" @click="navigate('/invoices')">{{ messages['nav.invoices'] }}</button>
      <button type="button" :style="navBtnStyle" @click="navigate('/bills')">{{ messages['nav.bills'] }}</button>
      <button type="button" :style="navBtnStyle" @click="navigate('/subscriptions')">{{ messages['nav.subscriptions'] }}</button>
      <button type="button" :style="navBtnStyle" @click="navigate('/wallets')">{{ messages['nav.wallets'] }}</button>
      <button type="button" :style="navBtnStyle" @click="navigate('/payment-methods')">{{ messages['nav.payment_methods'] }}</button>
      <button type="button" :style="navBtnStyle" @click="navigate('/payout-accounts')">{{ messages['nav.payout_accounts'] }}</button>
    </nav>

    <PortalDashboardPage
      v-if="!match || match.name === 'dashboard'"
      @invoice-click="(i) => navigate('/invoices/' + i.id)"
      @bill-click="(b) => navigate('/bills/' + b.id)"
    />
    <PortalInvoicesPage
      v-else-if="match.name === 'invoices'"
      @invoice-click="(i) => navigate('/invoices/' + i.id)"
    />
    <PortalInvoiceDetailPage
      v-else-if="match.name === 'invoice-detail'"
      :invoice-id="match.params.id!"
    />
    <PortalBillsPage
      v-else-if="match.name === 'bills'"
      @bill-click="(b) => navigate('/bills/' + b.id)"
    />
    <PortalBillDetailPage
      v-else-if="match.name === 'bill-detail'"
      :bill-id="match.params.id!"
    />
    <PortalSubscriptionsPage v-else-if="match.name === 'subscriptions'" />
    <PortalWalletsPage
      v-else-if="match.name === 'wallets'"
      @wallet-click="(w) => navigate('/wallets/' + w.id)"
    />
    <PortalWalletDetailPage
      v-else-if="match.name === 'wallet-detail'"
      :wallet-id="match.params.id!"
    />
    <PortalPaymentMethodsPage v-else-if="match.name === 'payment-methods'" />
    <PortalPayoutAccountsPage v-else-if="match.name === 'payout-accounts'" />
    <PortalDashboardPage v-else />
  </div>
</template>
