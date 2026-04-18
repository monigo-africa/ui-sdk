<script setup lang="ts">
import type { CustomerPaymentMethod } from '@monigo/portal-core'

interface Props {
  method: CustomerPaymentMethod
  class?: string
}
const props = withDefaults(defineProps<Props>(), { class: '' })
</script>

<template>
  <div
    :class="['monigo-pm-card', props.class]"
    :style="{
      padding: 'var(--monigo-space-4)',
      border: '1px solid var(--monigo-color-border)',
      borderRadius: 'var(--monigo-radius-md)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--monigo-space-3)',
    }"
  >
    <div :style="{ flex: '1' }">
      <p :style="{ margin: '0 0 var(--monigo-space-1)', fontWeight: '500', fontSize: 'var(--monigo-text-sm)' }">
        {{ props.method.brand ? `${props.method.brand} ` : '' }}{{ props.method.last4 ? `••••${props.method.last4}` : props.method.type }}
      </p>
      <p
        v-if="props.method.exp_month && props.method.exp_year"
        :style="{ margin: '0', fontSize: 'var(--monigo-text-xs)', color: 'var(--monigo-color-muted-fg)' }"
      >
        Expires {{ String(props.method.exp_month).padStart(2, '0') }}/{{ props.method.exp_year }}
      </p>
    </div>
    <span
      v-if="props.method.is_default"
      :style="{
        padding: '2px var(--monigo-space-2)',
        background: 'color-mix(in srgb, var(--monigo-color-success) 15%, transparent)',
        color: 'var(--monigo-color-success)',
        borderRadius: 'var(--monigo-radius-sm)',
        fontSize: 'var(--monigo-text-xs)',
        fontWeight: '500',
      }"
    >
      Default
    </span>
  </div>
</template>
