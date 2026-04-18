<script setup lang="ts">
import { useMonigoContext } from '../provider/context'

interface Props {
  label?: string
  class?: string
}
const props = withDefaults(defineProps<Props>(), { class: '' })
const emit = defineEmits<{ add: [] }>()

const { messages } = useMonigoContext()
</script>

<template>
  <button
    type="button"
    :class="['monigo-add-pm-btn', props.class]"
    :style="{
      padding: 'var(--monigo-space-2) var(--monigo-space-4)',
      background: 'var(--monigo-color-primary)',
      color: 'var(--monigo-color-primary-fg)',
      border: 'none',
      borderRadius: 'var(--monigo-radius-md)',
      fontSize: 'var(--monigo-text-sm)',
      cursor: 'pointer',
    }"
    @click="emit('add')"
  >
    {{ props.label ?? messages['payment_methods.action.add'] }}
  </button>
</template>
