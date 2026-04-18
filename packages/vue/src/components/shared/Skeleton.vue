<script setup lang="ts">
interface Props {
  rows?: number
  class?: string
}
const props = withDefaults(defineProps<Props>(), { rows: 3, class: '' })
</script>

<template>
  <div :class="['monigo-skeleton', props.class]" aria-busy="true" aria-live="polite">
    <style>@keyframes monigo-pulse{0%,100%{opacity:.7}50%{opacity:1}}</style>
    <div
      v-for="i in props.rows"
      :key="i"
      :style="{
        height: '1.25rem',
        margin: 'var(--monigo-space-2) 0',
        background: 'var(--monigo-color-muted)',
        borderRadius: 'var(--monigo-radius-sm)',
        animation: 'monigo-pulse 1.5s ease-in-out infinite',
      }"
    />
  </div>
</template>
