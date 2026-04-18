<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { formatCurrency, formatDate, type PortalLedgerEntry } from '@monigo/portal-core'
import { useMonigoContext } from '../provider/context'
import Skeleton from './shared/Skeleton.vue'
import EmptyState from './shared/EmptyState.vue'
import ErrorState from './shared/ErrorState.vue'

interface Props {
  walletId: string
  page?: number
  limit?: number
  class?: string
}
const props = withDefaults(defineProps<Props>(), { page: 1, limit: 20, class: '' })

const { client, locale, messages } = useMonigoContext()

type ListStatus = 'loading' | 'ready' | 'error'
const status = ref<ListStatus>('loading')
const entries = ref<PortalLedgerEntry[]>([])
const loadError = ref<Error | null>(null)

const load = async () => {
  status.value = 'loading'
  loadError.value = null
  try {
    const res = await client.getWalletTransactions(props.walletId, props.page, props.limit)
    entries.value = res.entries
    status.value = 'ready'
  } catch (err) {
    loadError.value = err instanceof Error ? err : new Error(String(err))
    status.value = 'error'
  }
}

onMounted(load)

const cellStyle = {
  padding: 'var(--monigo-space-3)',
  textAlign: 'left' as const,
  fontSize: 'var(--monigo-text-sm)',
  borderBottom: '1px solid var(--monigo-color-border)',
}
const thStyle = { ...cellStyle, color: 'var(--monigo-color-muted-fg)', fontWeight: '500' }
</script>

<template>
  <div :class="['monigo-wallet-tx-list', props.class]">
    <Skeleton v-if="status === 'loading'" :rows="5" />
    <ErrorState
      v-else-if="status === 'error' && loadError"
      :error="loadError"
      :on-retry="load"
      :retry-label="messages['common.retry']"
    />
    <EmptyState v-else-if="entries.length === 0" message="No transactions yet." />
    <table v-else :style="{ width: '100%', borderCollapse: 'collapse' }">
      <thead>
        <tr>
          <th :style="thStyle">Date</th>
          <th :style="thStyle">Type</th>
          <th :style="thStyle">Amount</th>
          <th :style="thStyle">Balance after</th>
          <th :style="thStyle">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in entries" :key="entry.id">
          <td :style="cellStyle">{{ formatDate(entry.created_at, locale) }}</td>
          <td :style="cellStyle">{{ entry.entry_type }}</td>
          <td :style="{ ...cellStyle, color: entry.direction === 'credit' ? 'var(--monigo-color-success)' : 'var(--monigo-color-danger)' }">
            {{ entry.direction === 'credit' ? '+' : '-' }}{{ formatCurrency(entry.amount, entry.currency, locale) }}
          </td>
          <td :style="cellStyle">{{ formatCurrency(entry.balance_after, entry.currency, locale) }}</td>
          <td :style="{ ...cellStyle, color: 'var(--monigo-color-muted-fg)' }">{{ entry.description ?? '—' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
