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
const emit = defineEmits<{ cancel: [sub: PortalSubscription] }>()

const { messages } = useMonigoContext()
const confirming = ref(false)

const handleClick = () => {
  if (!confirming.value) { confirming.value = true; return }
  confirming.value = false
  emit('cancel', props.subscription)
}
</script>

<template>
  <button
    type="button"
    :class="['monigo-cancel-sub-btn', props.class]"
    :style="{
      padding: 'var(--monigo-space-2) var(--monigo-space-4)',
      background: confirming ? 'var(--monigo-color-danger)' : 'transparent',
      color: confirming ? 'var(--monigo-color-danger-fg)' : 'var(--monigo-color-danger)',
      border: '1px solid var(--monigo-color-danger)',
      borderRadius: 'var(--monigo-radius-md)',
      fontSize: 'var(--monigo-text-sm)',
      cursor: 'pointer',
    }"
    @click="handleClick"
  >
    {{ confirming ? messages['subscriptions.cancel.confirm'] : (props.label ?? messages['subscriptions.action.cancel']) }}
  </button>
</template>
