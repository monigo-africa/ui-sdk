<script setup lang="ts">
import { ref } from 'vue'
import { useMonigoContext } from '../provider/context'

interface Props {
  label?: string
  class?: string
  onBefore?: () => boolean | Promise<boolean>
}
const props = withDefaults(defineProps<Props>(), { class: '' })
const emit = defineEmits<{
  add: []
  unsupported: []
  error: [err: unknown]
}>()

const { client, messages } = useMonigoContext()
const loading = ref(false)
const errorMessage = ref<string | null>(null)

async function handleClick(): Promise<void> {
  if (props.onBefore) {
    const ok = await props.onBefore()
    if (!ok) return
  }
  loading.value = true
  errorMessage.value = null
  try {
    const result = await client.setupPaymentMethod()
    emit('add')
    if (typeof window !== 'undefined') {
      window.location.href = result.authorization_url
    }
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err && (err as { status: number }).status === 501) {
      emit('unsupported')
      errorMessage.value = messages['payment_methods.setup.unsupported']
    } else {
      errorMessage.value = err instanceof Error ? err.message : String(err)
      emit('error', err)
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <button
    type="button"
    :class="['monigo-add-pm-btn', props.class]"
    :disabled="loading"
    :aria-busy="loading"
    :style="{
      padding: 'var(--monigo-space-2) var(--monigo-space-4)',
      background: 'var(--monigo-color-primary)',
      color: 'var(--monigo-color-primary-fg)',
      border: 'none',
      borderRadius: 'var(--monigo-radius-md)',
      fontSize: 'var(--monigo-text-sm)',
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.6 : 1,
    }"
    @click="handleClick"
  >
    {{ loading ? messages['common.loading'] : (props.label ?? messages['payment_methods.action.add']) }}
  </button>
  <p
    v-if="errorMessage"
    role="alert"
    :style="{ color: 'var(--monigo-color-danger)', fontSize: 'var(--monigo-text-sm)', marginTop: 'var(--monigo-space-1)' }"
  >
    {{ errorMessage }}
  </p>
</template>
