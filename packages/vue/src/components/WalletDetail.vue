<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { formatCurrency, type PortalWallet } from '@monigo/portal-core'
import { useMonigoContext } from '../provider/context'
import Skeleton from './shared/Skeleton.vue'
import ErrorState from './shared/ErrorState.vue'

interface Props {
  walletId: string
  class?: string
}
const props = withDefaults(defineProps<Props>(), { class: '' })

const { client, locale, messages } = useMonigoContext()

type DetailStatus = 'loading' | 'ready' | 'error'
const status = ref<DetailStatus>('loading')
const wallet = ref<PortalWallet | null>(null)
const loadError = ref<Error | null>(null)

const load = async () => {
  status.value = 'loading'
  loadError.value = null
  try {
    const { wallet: w } = await client.getWallet(props.walletId)
    wallet.value = w
    status.value = 'ready'
  } catch (err) {
    loadError.value = err instanceof Error ? err : new Error(String(err))
    status.value = 'error'
  }
}

onMounted(load)
</script>

<template>
  <Skeleton v-if="status === 'loading'" :rows="4" />
  <ErrorState
    v-else-if="status === 'error' && loadError"
    :error="loadError"
    :on-retry="load"
    :retry-label="messages['common.retry']"
  />
  <article v-else-if="status === 'ready' && wallet" :class="['monigo-wallet-detail', props.class]">
    <header :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: 'var(--monigo-space-6) 0', borderBottom: '1px solid var(--monigo-color-border)' }">
      <div>
        <h2 :style="{ margin: '0 0 var(--monigo-space-1)', fontSize: 'var(--monigo-text-xl)' }">{{ wallet.currency }} Wallet</h2>
        <p :style="{ color: wallet.status === 'active' ? 'var(--monigo-color-success)' : 'var(--monigo-color-muted-fg)', fontSize: 'var(--monigo-text-sm)', margin: '0' }">
          {{ wallet.status }}
        </p>
      </div>
      <p :style="{ fontSize: 'var(--monigo-text-2xl)', fontWeight: '700', margin: '0' }">
        {{ formatCurrency(wallet.balance, wallet.currency, locale) }}
      </p>
    </header>

    <section v-if="wallet.virtual_accounts.length > 0" :style="{ padding: 'var(--monigo-space-5) 0' }">
      <h3 :style="{ margin: '0 0 var(--monigo-space-3)', fontSize: 'var(--monigo-text-md)' }">Virtual accounts</h3>
      <ul :style="{ listStyle: 'none', margin: '0', padding: '0' }">
        <li
          v-for="va in wallet.virtual_accounts"
          :key="va.id"
          :style="{ padding: 'var(--monigo-space-3)', border: '1px solid var(--monigo-color-border)', borderRadius: 'var(--monigo-radius-sm)', marginBottom: 'var(--monigo-space-2)', fontSize: 'var(--monigo-text-sm)' }"
        >
          <p :style="{ margin: '0 0 var(--monigo-space-1)', fontWeight: '500' }">{{ va.bank_name ?? va.provider }}</p>
          <p :style="{ margin: '0', color: 'var(--monigo-color-muted-fg)' }">{{ va.account_number }} — {{ va.account_name }}</p>
        </li>
      </ul>
    </section>
  </article>
</template>
