<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { formatCurrency, type DashboardSnapshot } from '@monigo/portal-core'
import { useMonigoContext } from '../provider/context'
import { useDashboard } from '../stores/useDashboard'
import Skeleton from './shared/Skeleton.vue'
import ErrorState from './shared/ErrorState.vue'

// NOTE: DashboardSummary and RecentActivity each call useDashboard(client),
// resulting in two store instances and two API round-trips when both are on
// the same page. Intentional for v1 simplicity — consolidate via context in
// a future iteration.

interface Props { class?: string }
const props = withDefaults(defineProps<Props>(), { class: '' })

const { client, messages, locale } = useMonigoContext()
const { state, dispatch, dispose } = useDashboard(client)

onMounted(() => dispatch({ type: 'load' }))
onUnmounted(dispose)

const snapshot = computed<DashboardSnapshot | undefined>(() =>
  'snapshot' in state.value ? state.value.snapshot : undefined
)

const outstanding = computed(() => {
  if (!snapshot.value) return 0
  return snapshot.value.invoices
    .filter((i) => i.status === 'finalized')
    .reduce((sum, i) => sum + parseFloat(i.total), 0)
})

const invoiceCurrency = computed(() => {
  if (!snapshot.value) return 'NGN'
  return snapshot.value.invoices[0]?.currency ?? 'NGN'
})

const activeWallets = computed(() => {
  if (!snapshot.value) return []
  return snapshot.value.wallets.filter((w) => w.status === 'active')
})

const totalWalletBalance = computed(() =>
  activeWallets.value.reduce((sum, w) => sum + parseFloat(w.balance), 0)
)

const walletCurrency = computed(() => activeWallets.value[0]?.currency ?? 'NGN')

const activeSubCount = computed(() => {
  if (!snapshot.value) return 0
  return snapshot.value.subscriptions.filter((s) => s.status !== 'canceled').length
})

const stateError = computed<Error | null>(() =>
  state.value.status === 'error' ? (state.value as unknown as { error: Error }).error : null
)

const cardStyle = {
  padding: 'var(--monigo-space-4)',
  border: '1px solid var(--monigo-color-border)',
  borderRadius: 'var(--monigo-radius-md)',
  background: 'var(--monigo-color-muted)',
}
</script>

<template>
  <Skeleton v-if="(state.status === 'idle' || state.status === 'loading') && !snapshot" :rows="3" />
  <ErrorState
    v-else-if="state.status === 'error' && !snapshot && stateError"
    :error="stateError"
    :on-retry="() => dispatch({ type: 'refresh' })"
    :retry-label="messages['common.retry']"
  />
  <Skeleton v-else-if="!snapshot" :rows="3" />
  <div
    v-else
    :class="['monigo-dashboard-summary', props.class]"
    :style="{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--monigo-space-4)' }"
  >
    <div :style="cardStyle">
      <p :style="{ fontSize: 'var(--monigo-text-xs)', color: 'var(--monigo-color-muted-fg)', margin: '0 0 var(--monigo-space-2)' }">{{ messages['dashboard.outstanding'] }}</p>
      <p :style="{ fontSize: 'var(--monigo-text-xl)', fontWeight: '700', color: 'var(--monigo-color-fg)', margin: '0 0 var(--monigo-space-1)' }">{{ formatCurrency(outstanding, invoiceCurrency, locale) }}</p>
      <p :style="{ fontSize: 'var(--monigo-text-xs)', color: 'var(--monigo-color-muted-fg)', margin: '0' }">Awaiting payment</p>
    </div>

    <div v-if="activeWallets.length > 0" :style="cardStyle">
      <p :style="{ fontSize: 'var(--monigo-text-xs)', color: 'var(--monigo-color-muted-fg)', margin: '0 0 var(--monigo-space-2)' }">{{ messages['dashboard.wallet_balance'] }}</p>
      <p :style="{ fontSize: 'var(--monigo-text-xl)', fontWeight: '700', color: 'var(--monigo-color-fg)', margin: '0 0 var(--monigo-space-1)' }">{{ formatCurrency(totalWalletBalance, walletCurrency, locale) }}</p>
      <p :style="{ fontSize: 'var(--monigo-text-xs)', color: 'var(--monigo-color-muted-fg)', margin: '0' }">Available</p>
    </div>

    <div :style="cardStyle">
      <p :style="{ fontSize: 'var(--monigo-text-xs)', color: 'var(--monigo-color-muted-fg)', margin: '0 0 var(--monigo-space-2)' }">Active subscriptions</p>
      <p :style="{ fontSize: 'var(--monigo-text-xl)', fontWeight: '700', color: 'var(--monigo-color-primary)', margin: '0 0 var(--monigo-space-1)' }">{{ activeSubCount }}</p>
      <p :style="{ fontSize: 'var(--monigo-text-xs)', color: 'var(--monigo-color-muted-fg)', margin: '0' }">{{ activeSubCount === 1 ? 'plan' : 'plans' }}</p>
    </div>
  </div>
</template>
