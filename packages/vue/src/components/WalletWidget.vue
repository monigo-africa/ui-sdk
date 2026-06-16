<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import {
  launchCheckout, createBalancePoller, formatCurrency,
  type PortalWallet, type BalancePoller,
} from '@monigo/portal-core'
import { useMonigoContext } from '../provider/context'

interface Props {
  walletId: string
  currency: string
  presets?: number[]
  pollIntervalMs?: number
  class?: string
}
const props = withDefaults(defineProps<Props>(), { presets: () => [1000, 5000, 10000], pollIntervalMs: 8000, class: '' })
const emit = defineEmits<{ funded: [reference: string]; error: [err: unknown] }>()

const { client, messages, locale } = useMonigoContext()

type View = 'loading' | 'ready' | 'error' | 'funding' | 'confirming'
const view = ref<View>('loading')
const balance = ref('0')
const status = ref<PortalWallet['status']>('active')
const amount = ref('')
const open = ref(false)
const showStripe = ref(false)
const stripeMount = ref<HTMLDivElement | null>(null)
let poller: BalancePoller | undefined
let abortController: AbortController | undefined

function startPoller() {
  poller?.stop()
  poller = createBalancePoller(client, props.walletId, {
    intervalMs: props.pollIntervalMs,
    onBalance: (b, w) => { balance.value = b; status.value = (w as PortalWallet).status; if (view.value === 'loading') view.value = 'ready' },
    onError: (err) => { if (view.value === 'loading') view.value = 'error'; emit('error', err) },
  })
  poller.start()
}

onMounted(startPoller)
// Re-subscribe if the wallet or interval changes (parity with the React/Svelte widgets).
watch(() => [props.walletId, props.pollIntervalMs], startPoller)
onUnmounted(() => { poller?.stop(); abortController?.abort() })

async function fund() {
  const amt = parseFloat(amount.value)
  if (!amt || amt <= 0) return
  view.value = 'funding'
  const controller = new AbortController()
  abortController = controller
  try {
    const session = await client.initWalletFunding(props.walletId, { amount: String(amount.value), currency: props.currency })
    if (session.provider === 'stripe') {
      showStripe.value = true
      await nextTick() // flush so the stripeMount ref is attached before launch
    }
    const result = await launchCheckout(session, {
      ...(stripeMount.value ? { mountEl: stripeMount.value } : {}),
      signal: controller.signal,
    })
    showStripe.value = false
    if (result.status === 'success') {
      view.value = 'confirming'
      try { await poller?.refreshNow() } catch { /* surfaced via onError */ }
      view.value = 'ready'; open.value = false; amount.value = ''
      emit('funded', result.reference)
    } else {
      view.value = 'ready'
    }
  } catch (err) {
    showStripe.value = false
    try {
      const redirect = await client.fundWallet(props.walletId, { amount: String(amount.value), currency: props.currency })
      if (typeof window !== 'undefined') { window.location.href = redirect.authorization_url; return }
    } catch { /* ignore */ }
    view.value = 'ready'; emit('error', err)
  }
}

function cancelFunding() {
  abortController?.abort()
  showStripe.value = false; open.value = false; amount.value = ''
  if (view.value === 'funding' || view.value === 'confirming') view.value = 'ready'
}
</script>

<template>
  <section :class="['monigo-wallet-widget', props.class]" :style="{ padding: 'var(--monigo-space-5)', border: '1px solid var(--monigo-color-border)', borderRadius: 'var(--monigo-radius-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--monigo-space-3)' }">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <span :style="{ fontWeight: '600' }">{{ props.currency }} balance</span>
      <span :style="{ fontSize: 'var(--monigo-text-xs)', color: 'var(--monigo-color-muted-fg)', textTransform: 'uppercase' }">{{ status }}</span>
    </div>

    <p v-if="view === 'loading'" :style="{ margin: '0', color: 'var(--monigo-color-muted-fg)' }">…</p>
    <p v-else-if="view === 'error'" :style="{ margin: '0', color: 'var(--monigo-color-danger)' }">Unable to load balance</p>
    <p v-else class="font-numeric" :style="{ fontSize: 'var(--monigo-text-2xl)', fontWeight: '700', margin: '0' }">
      {{ formatCurrency(balance, props.currency, locale) }}
    </p>

    <button v-if="!open" type="button" class="primary"
      :style="{ padding: 'var(--monigo-space-2) var(--monigo-space-4)', background: 'var(--monigo-color-primary)', color: 'var(--monigo-color-primary-fg)', border: 'none', borderRadius: 'var(--monigo-radius-md)', fontSize: 'var(--monigo-text-sm)', cursor: 'pointer' }"
      :disabled="view === 'loading'" @click="open = true">
      {{ messages['wallets.action.fund'] }}
    </button>

    <form v-else @submit.prevent="fund" :style="{ display: 'flex', flexDirection: 'column', gap: 'var(--monigo-space-2)' }">
      <div :style="{ display: 'flex', gap: 'var(--monigo-space-2)', flexWrap: 'wrap' }">
        <button v-for="p in props.presets" :key="p" type="button" :disabled="view === 'funding'" @click="amount = String(p)"
          :style="{ padding: 'var(--monigo-space-1) var(--monigo-space-3)', border: '1px solid var(--monigo-color-border)', borderRadius: 'var(--monigo-radius-md)', background: 'var(--monigo-color-muted)', cursor: 'pointer', fontSize: 'var(--monigo-text-sm)' }">
          {{ formatCurrency(String(p), props.currency, locale) }}
        </button>
      </div>
      <input v-model="amount" type="number" step="0.01" min="0" required aria-label="Amount" :placeholder="`Amount (${props.currency})`" :disabled="view === 'funding'"
        :style="{ padding: 'var(--monigo-space-2)', border: '1px solid var(--monigo-color-border)', borderRadius: 'var(--monigo-radius-sm)', fontSize: 'var(--monigo-text-sm)' }" />
      <div :style="{ display: 'flex', gap: 'var(--monigo-space-2)' }">
        <button type="submit" class="primary" :disabled="view === 'funding' || !amount"
          :style="{ padding: 'var(--monigo-space-2) var(--monigo-space-4)', background: 'var(--monigo-color-primary)', color: 'var(--monigo-color-primary-fg)', border: 'none', borderRadius: 'var(--monigo-radius-md)', fontSize: 'var(--monigo-text-sm)', cursor: 'pointer' }">
          {{ view === 'funding' ? messages['common.loading'] : messages['common.confirm'] }}
        </button>
        <button type="button" :disabled="view === 'confirming'" @click="cancelFunding"
          :style="{ padding: 'var(--monigo-space-2) var(--monigo-space-3)', background: 'transparent', color: 'var(--monigo-color-muted-fg)', border: '1px solid var(--monigo-color-border)', borderRadius: 'var(--monigo-radius-md)', cursor: 'pointer' }">
          {{ messages['common.cancel'] }}
        </button>
      </div>
    </form>

    <p v-if="view === 'confirming'" :style="{ margin: '0', color: 'var(--monigo-color-muted-fg)', fontSize: 'var(--monigo-text-sm)' }">Confirming payment…</p>
    <div v-if="showStripe" ref="stripeMount" :style="{ marginTop: 'var(--monigo-space-3)' }"></div>
  </section>
</template>
