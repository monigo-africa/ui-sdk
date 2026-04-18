<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { formatCurrency, formatDate, type PortalInvoice, type Bill, type DashboardSnapshot } from '@monigo/portal-core'
import { useMonigoContext } from '../provider/context'
import { useDashboard } from '../stores/useDashboard'
import InvoiceStatusBadge from './InvoiceStatusBadge.vue'
import BillStatusBadge from './BillStatusBadge.vue'
import Skeleton from './shared/Skeleton.vue'
import ErrorState from './shared/ErrorState.vue'

interface Props { class?: string }
const props = withDefaults(defineProps<Props>(), { class: '' })
const emit = defineEmits<{
  invoiceClick: [inv: PortalInvoice]
  billClick: [bill: Bill]
}>()

const { client, messages, locale } = useMonigoContext()
const { state, dispatch, dispose } = useDashboard(client)

onMounted(() => dispatch({ type: 'load' }))
onUnmounted(dispose)

const snapshot = computed<DashboardSnapshot | undefined>(() =>
  'snapshot' in state.value ? state.value.snapshot : undefined
)

const recentInvoices = computed(() => {
  if (!snapshot.value) return []
  return snapshot.value.invoices.slice(0, 5)
})

const recentBills = computed(() => {
  if (!snapshot.value) return []
  return snapshot.value.bills.slice(0, 5)
})

const stateError = computed<Error | null>(() =>
  state.value.status === 'error' ? (state.value as unknown as { error: Error }).error : null
)

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 'var(--monigo-space-2) 0',
  borderBottom: '1px solid var(--monigo-color-border)',
  fontSize: 'var(--monigo-text-sm)',
  cursor: 'pointer',
}
</script>

<template>
  <Skeleton v-if="(state.status === 'idle' || state.status === 'loading') && !snapshot" :rows="5" />
  <ErrorState
    v-else-if="state.status === 'error' && !snapshot && stateError"
    :error="stateError"
    :on-retry="() => dispatch({ type: 'refresh' })"
    :retry-label="messages['common.retry']"
  />
  <Skeleton v-else-if="!snapshot" :rows="5" />
  <div v-else :class="['monigo-recent-activity', props.class]">
    <section v-if="recentInvoices.length > 0" :style="{ marginBottom: 'var(--monigo-space-5)' }">
      <h3 :style="{ fontSize: 'var(--monigo-text-md)', margin: '0 0 var(--monigo-space-3)' }">{{ messages['dashboard.recent_invoices'] }}</h3>
      <ul :style="{ listStyle: 'none', margin: '0', padding: '0' }">
        <li
          v-for="inv in recentInvoices"
          :key="inv.id"
          :style="rowStyle"
          tabindex="0"
          role="button"
          @click="emit('invoiceClick', inv)"
          @keydown.enter="emit('invoiceClick', inv)"
        >
          <span>{{ inv.id }}</span>
          <span>{{ formatDate(inv.created_at, locale) }}</span>
          <span>{{ formatCurrency(inv.total, inv.currency, locale) }}</span>
          <InvoiceStatusBadge :status="inv.status" />
        </li>
      </ul>
    </section>

    <section v-if="recentBills.length > 0">
      <h3 :style="{ fontSize: 'var(--monigo-text-md)', margin: '0 0 var(--monigo-space-3)' }">{{ messages['dashboard.recent_payouts'] }}</h3>
      <ul :style="{ listStyle: 'none', margin: '0', padding: '0' }">
        <li
          v-for="bill in recentBills"
          :key="bill.id"
          :style="rowStyle"
          tabindex="0"
          role="button"
          @click="emit('billClick', bill)"
          @keydown.enter="emit('billClick', bill)"
        >
          <span>{{ bill.number }}</span>
          <span>{{ formatDate(bill.issued_at, locale) }}</span>
          <span>{{ formatCurrency(bill.total, bill.currency, locale) }}</span>
          <BillStatusBadge :status="bill.status" />
        </li>
      </ul>
    </section>
  </div>
</template>
