<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { formatCurrency, formatDate, type Bill } from '@monigo/portal-core'
import { useMonigoContext } from '../provider/context'
import { useBills } from '../stores/useBills'
import BillStatusBadge from './BillStatusBadge.vue'
import Skeleton from './shared/Skeleton.vue'
import EmptyState from './shared/EmptyState.vue'
import ErrorState from './shared/ErrorState.vue'

interface Props {
  limit?: number
  page?: number
  class?: string
}
const props = withDefaults(defineProps<Props>(), { limit: 20, page: 1, class: '' })
const emit = defineEmits<{ billClick: [bill: Bill] }>()

const { client, messages, locale } = useMonigoContext()
const { state, dispatch, dispose } = useBills(client)

onMounted(() => dispatch({ type: 'load', page: props.page, limit: props.limit }))
onUnmounted(dispose)

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse' as const,
}
const cellStyle = {
  padding: 'var(--monigo-space-3)',
  textAlign: 'left' as const,
  fontSize: 'var(--monigo-text-sm)',
  borderBottom: '1px solid var(--monigo-color-border)',
}
const thStyle = { ...cellStyle, color: 'var(--monigo-color-muted-fg)', fontWeight: '500' }
</script>

<template>
  <div :class="['monigo-bill-list', props.class]">
    <Skeleton v-if="state.status === 'idle' || state.status === 'loading'" :rows="5" />
    <ErrorState
      v-else-if="state.status === 'error'"
      :error="state.error"
      :on-retry="() => dispatch({ type: 'refresh' })"
      :retry-label="messages['common.retry']"
    />
    <EmptyState v-else-if="state.bills.length === 0" :message="messages['bills.empty']" />
    <table v-else :style="tableStyle">
      <thead>
        <tr>
          <th :style="thStyle">Payout #</th>
          <th :style="thStyle">Date</th>
          <th :style="thStyle">Amount</th>
          <th :style="thStyle">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="bill in state.bills"
          :key="bill.id"
          :style="{ cursor: 'pointer' }"
          class="monigo-row"
          tabindex="0"
          role="button"
          @click="emit('billClick', bill)"
          @keydown.enter="emit('billClick', bill)"
        >
          <td :style="cellStyle">{{ bill.number }}</td>
          <td :style="cellStyle">{{ formatDate(bill.issued_at, locale) }}</td>
          <td :style="cellStyle">{{ formatCurrency(bill.total, bill.currency, locale) }}</td>
          <td :style="cellStyle"><BillStatusBadge :status="bill.status" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.monigo-row:hover { background: var(--monigo-color-muted); }
.monigo-row:focus-visible { outline: 2px solid var(--monigo-color-primary); outline-offset: -2px; }
</style>
