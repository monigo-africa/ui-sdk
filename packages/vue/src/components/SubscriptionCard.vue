<script setup lang="ts">
import { computed } from 'vue'
import { formatSubscriptionStatus, formatDate, type PortalSubscription } from '@monigo/portal-core'

interface Props {
  subscription: PortalSubscription
  class?: string
}
const props = withDefaults(defineProps<Props>(), { class: '' })

const sub = computed(() => props.subscription)
const statusColor = computed(() =>
  sub.value.status === 'active' || (sub.value.status as string) === 'trialing'
    ? 'var(--monigo-color-success)'
    : 'var(--monigo-color-muted-fg)'
)
</script>

<template>
  <div
    :class="['monigo-sub-card', props.class]"
    :style="{ padding: 'var(--monigo-space-4)', border: '1px solid var(--monigo-color-border)', borderRadius: 'var(--monigo-radius-md)' }"
  >
    <div :style="{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--monigo-space-2)' }">
      <span :style="{ fontWeight: '600', fontSize: 'var(--monigo-text-md)' }">
        {{ sub.plan_name ?? sub.id }}
      </span>
      <span :style="{ fontSize: 'var(--monigo-text-xs)', color: statusColor }">
        {{ formatSubscriptionStatus(sub.status) }}
      </span>
    </div>
    <p
      v-if="sub.plan_type"
      :style="{ fontSize: 'var(--monigo-text-xs)', color: 'var(--monigo-color-muted-fg)', margin: '0 0 var(--monigo-space-1)' }"
    >
      {{ sub.plan_type }}
    </p>
    <p
      v-if="sub.current_period_end"
      :style="{ fontSize: 'var(--monigo-text-xs)', color: 'var(--monigo-color-muted-fg)', margin: '0' }"
    >
      Next billing: {{ formatDate(sub.current_period_end) }}
    </p>
  </div>
</template>
