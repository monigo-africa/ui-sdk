<script setup lang="ts">
import { computed } from 'vue'
import { formatBillStatus } from '@monigo/portal-core'

interface Props {
  status: string
  class?: string
}
const props = withDefaults(defineProps<Props>(), { class: '' })

type Variant = 'success' | 'danger' | 'warning' | 'muted'

const variant = computed<Variant>(() =>
  props.status === 'paid' ? 'success' :
  props.status === 'payout_failed' ? 'danger' :
  props.status === 'finalized' ? 'warning' :
  'muted'
)

const variantStyles: Record<Variant, Record<string, string>> = {
  success: {
    background: 'color-mix(in srgb, var(--monigo-color-success) 15%, transparent)',
    color: 'var(--monigo-color-success)',
  },
  danger: {
    background: 'color-mix(in srgb, var(--monigo-color-danger) 15%, transparent)',
    color: 'var(--monigo-color-danger)',
  },
  warning: {
    background: 'color-mix(in srgb, var(--monigo-color-warning) 15%, transparent)',
    color: 'var(--monigo-color-warning)',
  },
  muted: {
    background: 'var(--monigo-color-muted)',
    color: 'var(--monigo-color-muted-fg)',
  },
}

const badgeStyle = computed(() => ({
  display: 'inline-block',
  padding: '2px var(--monigo-space-2)',
  borderRadius: 'var(--monigo-radius-sm)',
  fontSize: 'var(--monigo-text-xs)',
  fontWeight: '500',
  lineHeight: '1.4',
  ...variantStyles[variant.value],
}))
</script>

<template>
  <span :class="['monigo-badge', props.class]" :style="badgeStyle">
    {{ formatBillStatus(props.status) }}
  </span>
</template>
