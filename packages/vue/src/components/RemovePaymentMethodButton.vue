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
  remove: []
  error: [err: unknown]
}>()

const { client, messages } = useMonigoContext()
const loading = ref(false)

const handleRemove = async () => {
  if (!window.confirm('Are you sure you want to remove this payment method?')) return
  loading.value = true
  try {
    await client.deletePaymentMethod(props.paymentMethodId)
    emit('remove')
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
    :class="['monigo-remove-pm-btn', props.class]"
    :disabled="loading"
    :style="{
      padding: 'var(--monigo-space-2) var(--monigo-space-3)',
      background: 'transparent',
      color: 'var(--monigo-color-danger)',
      border: '1px solid var(--monigo-color-danger)',
      borderRadius: 'var(--monigo-radius-sm)',
      fontSize: 'var(--monigo-text-sm)',
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? '0.6' : '1',
    }"
    @click="handleRemove"
  >
    {{ props.label ?? messages['payment_methods.action.remove'] }}
  </button>
</template>
