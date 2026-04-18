<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { formatCurrency, formatDate, type Bill, type PayoutTransaction } from '@monigo/portal-core'
import { useMonigoContext } from '../provider/context'
import BillStatusBadge from './BillStatusBadge.vue'
import Skeleton from './shared/Skeleton.vue'
import ErrorState from './shared/ErrorState.vue'

interface Props {
  billId: string
  class?: string
}
const props = withDefaults(defineProps<Props>(), { class: '' })

const { client, locale, messages } = useMonigoContext()

type DetailStatus = 'loading' | 'ready' | 'error'
const status = ref<DetailStatus>('loading')
const bill = ref<Bill | null>(null)
const transactions = ref<PayoutTransaction[]>([])
const loadError = ref<Error | null>(null)

const load = async () => {
  status.value = 'loading'
  loadError.value = null
  try {
    const [{ bill: b }, txRes] = await Promise.all([
      client.getBill(props.billId),
      client.getBillTransactions(props.billId).catch(() => ({ transactions: [] as PayoutTransaction[] })),
    ])
    bill.value = b
    transactions.value = txRes.transactions
    status.value = 'ready'
  } catch (err) {
    loadError.value = err instanceof Error ? err : new Error(String(err))
    status.value = 'error'
  }
}

onMounted(load)
</script>

<template>
  <Skeleton v-if="status === 'loading'" :rows="6" />
  <ErrorState
    v-else-if="status === 'error' && loadError"
    :error="loadError"
    :on-retry="load"
    :retry-label="messages['common.retry']"
  />
  <article v-else-if="status === 'ready' && bill" :class="['monigo-bill-detail', props.class]">
    <header :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: 'var(--monigo-space-6) 0', borderBottom: '1px solid var(--monigo-color-border)' }">
      <div>
        <h2 :style="{ margin: '0 0 var(--monigo-space-1)', fontSize: 'var(--monigo-text-xl)' }">{{ bill.number }}</h2>
        <p :style="{ color: 'var(--monigo-color-muted-fg)', fontSize: 'var(--monigo-text-sm)', margin: '0' }">{{ formatDate(bill.issued_at, locale) }}</p>
      </div>
      <div :style="{ textAlign: 'right' }">
        <p :style="{ fontSize: 'var(--monigo-text-2xl)', fontWeight: '600', marginBottom: 'var(--monigo-space-2)' }">{{ formatCurrency(bill.total, bill.currency, locale) }}</p>
        <BillStatusBadge :status="bill.status" />
      </div>
    </header>

    <section v-if="bill.line_items && (bill.line_items as unknown[]).length > 0" :style="{ padding: 'var(--monigo-space-5) 0' }">
      <h3 :style="{ margin: '0 0 var(--monigo-space-3)', fontSize: 'var(--monigo-text-md)' }">Line items</h3>
      <ul :style="{ listStyle: 'none', margin: '0', padding: '0' }">
        <li
          v-for="(line, i) in (bill.line_items as Array<{ description?: string; name?: string; amount?: string; total?: string }>)"
          :key="i"
          :style="{ display: 'flex', justifyContent: 'space-between', padding: 'var(--monigo-space-2) 0', borderBottom: '1px solid var(--monigo-color-border)', fontSize: 'var(--monigo-text-sm)' }"
        >
          <span>{{ line.description ?? line.name ?? 'Item' }}</span>
          <span>{{ formatCurrency(line.amount ?? line.total ?? '0', bill.currency, locale) }}</span>
        </li>
      </ul>
    </section>

    <section v-if="transactions.length > 0" :style="{ padding: 'var(--monigo-space-5) 0' }">
      <h3 :style="{ margin: '0 0 var(--monigo-space-3)', fontSize: 'var(--monigo-text-md)' }">Payout history</h3>
      <ul :style="{ listStyle: 'none', margin: '0', padding: '0' }">
        <li
          v-for="t in transactions"
          :key="t.id"
          :style="{ display: 'flex', justifyContent: 'space-between', padding: 'var(--monigo-space-2) 0', borderBottom: '1px solid var(--monigo-color-border)', fontSize: 'var(--monigo-text-sm)' }"
        >
          <span>{{ formatDate(t.created_at, locale) }}</span>
          <span>{{ formatCurrency(t.amount, t.currency, locale) }}</span>
          <span>{{ t.status }}</span>
        </li>
      </ul>
    </section>
  </article>
</template>
