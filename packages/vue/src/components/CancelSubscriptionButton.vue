<script setup lang="ts">
import { ref } from 'vue'
import { useMonigoContext } from '../provider/context'
import type { PortalSubscription } from '@monigo/portal-core'

interface Props {
  subscription: PortalSubscription
  label?: string
  class?: string
}
const props = withDefaults(defineProps<Props>(), { class: '' })
const emit = defineEmits<{
  cancel: [sub: PortalSubscription]
  error: [err: unknown]
}>()

const { client, messages } = useMonigoContext()
const loading = ref(false)
const errorMessage = ref<string | null>(null)

async function handleClick(): Promise<void> {
  if (typeof window === 'undefined') return
  const confirmed = window.confirm(messages['subscriptions.cancel.confirm'])
  if (!confirmed) return

  loading.value = true
  errorMessage.value = null
  try {
    await client.cancelSubscription(props.subscription.id)
    emit('cancel', props.subscription)
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : String(err)
    emit('error', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <button
    type="button"
    :class="['monigo-cancel-sub-btn', props.class]"
    :disabled="loading"
    :aria-busy="loading"
    :style="{
      padding: 'var(--monigo-space-2) var(--monigo-space-4)',
      background: 'transparent',
      color: 'var(--monigo-color-danger)',
      border: '1px solid var(--monigo-color-danger)',
      borderRadius: 'var(--monigo-radius-md)',
      fontSize: 'var(--monigo-text-sm)',
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.6 : 1,
    }"
    @click="handleClick"
  >
    {{ loading ? messages['common.loading'] : (props.label ?? messages['subscriptions.action.cancel']) }}
  </button>
  <p
    v-if="errorMessage"
    role="alert"
    :style="{ color: 'var(--monigo-color-danger)', fontSize: 'var(--monigo-text-sm)', marginTop: 'var(--monigo-space-1)' }"
  >
    {{ errorMessage }}
  </p>
</template>
