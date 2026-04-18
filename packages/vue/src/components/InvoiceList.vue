<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { formatCurrency, formatDate, type PortalInvoice } from '@monigo/portal-core'
import { useMonigoContext } from '../provider/context'
import { useInvoices } from '../stores/useInvoices'
import InvoiceStatusBadge from './InvoiceStatusBadge.vue'
import Skeleton from './shared/Skeleton.vue'
import EmptyState from './shared/EmptyState.vue'
import ErrorState from './shared/ErrorState.vue'

interface Props {
  limit?: number
  page?: number
  class?: string
}
const props = withDefaults(defineProps<Props>(), { limit: 20, page: 1, class: '' })
const emit = defineEmits<{ invoiceClick: [inv: PortalInvoice] }>()

const { client, messages, locale } = useMonigoContext()
const { state, dispatch, dispose } = useInvoices(client)

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
  <div :class="['monigo-invoice-list', props.class]">
    <Skeleton v-if="state.status === 'idle' || state.status === 'loading'" :rows="5" />
    <ErrorState
      v-else-if="state.status === 'error'"
      :error="state.error"
      :on-retry="() => dispatch({ type: 'refresh' })"
      :retry-label="messages['common.retry']"
    />
    <EmptyState v-else-if="state.invoices.length === 0" :message="messages['invoices.empty']" />
    <table v-else :style="tableStyle">
      <thead>
        <tr>
          <th :style="thStyle">{{ messages['invoices.column.number'] }}</th>
          <th :style="thStyle">{{ messages['invoices.column.date'] }}</th>
          <th :style="thStyle">{{ messages['invoices.column.amount'] }}</th>
          <th :style="thStyle">{{ messages['invoices.column.status'] }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="invoice in state.invoices"
          :key="invoice.id"
          :style="{ cursor: 'pointer' }"
          class="monigo-row"
          tabindex="0"
          role="button"
          @click="emit('invoiceClick', invoice)"
          @keydown.enter="emit('invoiceClick', invoice)"
        >
          <td :style="cellStyle">{{ invoice.id }}</td>
          <td :style="cellStyle">{{ formatDate(invoice.created_at, locale) }}</td>
          <td :style="cellStyle">{{ formatCurrency(invoice.total, invoice.currency, locale) }}</td>
          <td :style="cellStyle"><InvoiceStatusBadge :status="invoice.status" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.monigo-row:hover { background: var(--monigo-color-muted); }
.monigo-row:focus-visible { outline: 2px solid var(--monigo-color-primary); outline-offset: -2px; }
</style>
