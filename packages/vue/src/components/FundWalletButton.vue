<script setup lang="ts">
import { ref } from 'vue'
import { useMonigoContext } from '../provider/context'

interface Props {
  walletId: string
  currency: string
  label?: string
  class?: string
}
const props = withDefaults(defineProps<Props>(), { class: '' })
const emit = defineEmits<{
  success: [result: { authorization_url: string }]
  error: [err: unknown]
}>()

const { client, messages } = useMonigoContext()
const showInput = ref(false)
const amount = ref('')
const loading = ref(false)

const handleFund = async () => {
  if (!amount.value || loading.value) return
  loading.value = true
  try {
    const result = await client.fundWallet(props.walletId, {
      amount: amount.value,
      currency: props.currency,
    })
    emit('success', result)
    if (typeof window !== 'undefined') {
      window.location.href = result.authorization_url
    }
  } catch (err) {
    emit('error', err)
  } finally {
    loading.value = false
    showInput.value = false
    amount.value = ''
  }
}
</script>

<template>
  <div :class="['monigo-fund-wallet-btn', props.class]">
    <button
      v-if="!showInput"
      type="button"
      :style="{
        padding: 'var(--monigo-space-2) var(--monigo-space-4)',
        background: 'var(--monigo-color-primary)',
        color: 'var(--monigo-color-primary-fg)',
        border: 'none',
        borderRadius: 'var(--monigo-radius-md)',
        fontSize: 'var(--monigo-text-sm)',
        cursor: 'pointer',
      }"
      @click="showInput = true"
    >
      {{ props.label ?? messages['wallets.action.fund'] }}
    </button>
    <div
      v-else
      :style="{ display: 'flex', gap: 'var(--monigo-space-2)', alignItems: 'center' }"
    >
      <input
        v-model="amount"
        type="number"
        min="0"
        :placeholder="`Amount (${props.currency})`"
        :style="{
          padding: 'var(--monigo-space-2)',
          border: '1px solid var(--monigo-color-border)',
          borderRadius: 'var(--monigo-radius-sm)',
          fontSize: 'var(--monigo-text-sm)',
          width: '140px',
        }"
      />
      <button
        type="button"
        :disabled="loading || !amount"
        :style="{
          padding: 'var(--monigo-space-2) var(--monigo-space-3)',
          background: 'var(--monigo-color-primary)',
          color: 'var(--monigo-color-primary-fg)',
          border: 'none',
          borderRadius: 'var(--monigo-radius-sm)',
          fontSize: 'var(--monigo-text-sm)',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? '0.6' : '1',
        }"
        @click="handleFund"
      >
        {{ loading ? messages['common.loading'] : messages['common.confirm'] }}
      </button>
      <button
        type="button"
        :style="{
          padding: 'var(--monigo-space-2) var(--monigo-space-3)',
          background: 'transparent',
          color: 'var(--monigo-color-muted-fg)',
          border: '1px solid var(--monigo-color-border)',
          borderRadius: 'var(--monigo-radius-sm)',
          fontSize: 'var(--monigo-text-sm)',
          cursor: 'pointer',
        }"
        @click="showInput = false; amount = ''"
      >
        {{ messages['common.cancel'] }}
      </button>
    </div>
  </div>
</template>
