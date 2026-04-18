<script setup lang="ts">
import { ref } from 'vue'
import { useMonigoContext } from '../provider/context'

interface Props {
  paymentMethodId: string
  label?: string
  class?: string
}
const props = withDefaults(defineProps<Props>(), { class: '' })
const emit = defineEmits<{
  set: []
  error: [err: unknown]
}>()

const { client, messages } = useMonigoContext()
const loading = ref(false)

const handleSet = async () => {
  loading.value = true
  try {
    await client.setDefaultPaymentMethod(props.paymentMethodId)
    emit('set')
  } catch (err) {
    emit('error', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <button
    type="button"
    :class="['monigo-set-default-pm-btn', props.class]"
    :disabled="loading"
    :style="{
      padding: 'var(--monigo-space-2) var(--monigo-space-3)',
      background: 'transparent',
      color: 'var(--monigo-color-muted-fg)',
      border: '1px solid var(--monigo-color-border)',
      borderRadius: 'var(--monigo-radius-sm)',
      fontSize: 'var(--monigo-text-sm)',
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? '0.6' : '1',
    }"
    @click="handleSet"
  >
    {{ props.label ?? messages['payment_methods.action.default'] }}
  </button>
</template>
