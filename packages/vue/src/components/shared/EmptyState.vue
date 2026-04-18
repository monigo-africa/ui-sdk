<script setup lang="ts">
interface Props {
  message: string
  class?: string
}
const props = defineProps<Props>()
</script>

<template>
  <p
    :class="['monigo-empty', props.class]"
    :style="{
      padding: 'var(--monigo-space-6)',
      textAlign: 'center',
      color: 'var(--monigo-color-muted-fg)',
      fontSize: 'var(--monigo-text-sm)',
    }"
  >
    {{ props.message }}
  </p>
</template>
