<script setup lang="ts">
import { ref } from 'vue'
import { useMonigoContext } from '../provider/context'

interface Props {
  invoiceId: string
  label?: string
  class?: string
  onBefore?: () => boolean | Promise<boolean>
  onSuccess?: (result: { authorization_url: string }) => void
  onError?: (err: unknown) => void
}
const props = withDefaults(defineProps<Props>(), { class: '' })

const { client, messages } = useMonigoContext()
const loading = ref(false)

const pay = async () => {
  if (props.onBefore) {
    const ok = await props.onBefore()
    if (!ok) return
  }
  loading.value = true
  try {
    const result = await client.payInvoice(props.invoiceId)
    props.onSuccess?.(result)
    if (typeof window !== 'undefined') {
      window.location.href = result.authorization_url
    }
  } catch (err) {
    props.onError?.(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <button
    type="button"
    :class="['monigo-pay-btn', props.class]"
    :disabled="loading"
    :aria-busy="loading"
    :style="{
      padding: 'var(--monigo-space-3) var(--monigo-space-5)',
      background: 'var(--monigo-color-primary)',
      color: 'var(--monigo-color-primary-fg)',
      border: 'none',
      borderRadius: 'var(--monigo-radius-md)',
      fontSize: 'var(--monigo-text-md)',
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? '0.6' : '1',
    }"
    @click="pay"
  >
    {{ loading ? messages['common.loading'] : (props.label ?? messages['invoices.action.pay']) }}
  </button>
</template>
