<script setup lang="ts">
interface Props {
  error: Error
  onRetry?: () => void
  retryLabel?: string
  class?: string
}
const props = withDefaults(defineProps<Props>(), { retryLabel: 'Try again', class: '' })
</script>

<template>
  <div
    :class="['monigo-error', props.class]"
    role="alert"
    :style="{ padding: 'var(--monigo-space-6)', textAlign: 'center' }"
  >
    <p :style="{ color: 'var(--monigo-color-danger)', marginBottom: 'var(--monigo-space-3)' }">
      {{ props.error.message }}
    </p>
    <button
      v-if="props.onRetry"
      type="button"
      @click="props.onRetry()"
      :style="{
        padding: 'var(--monigo-space-2) var(--monigo-space-4)',
        background: 'var(--monigo-color-primary)',
        color: 'var(--monigo-color-primary-fg)',
        border: 'none',
        borderRadius: 'var(--monigo-radius-md)',
        cursor: 'pointer',
      }"
    >
      {{ props.retryLabel }}
    </button>
  </div>
</template>
