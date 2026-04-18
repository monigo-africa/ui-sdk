<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useMonigoContext } from '../provider/context'
import { useSubscriptions } from '../stores/useSubscriptions'
import SubscriptionCard from './SubscriptionCard.vue'
import Skeleton from './shared/Skeleton.vue'
import EmptyState from './shared/EmptyState.vue'
import ErrorState from './shared/ErrorState.vue'

interface Props { class?: string }
const props = withDefaults(defineProps<Props>(), { class: '' })

const { client, messages } = useMonigoContext()
const { state, dispatch, dispose } = useSubscriptions(client)

onMounted(() => dispatch({ type: 'load' }))
onUnmounted(dispose)
</script>

<template>
  <div :class="['monigo-sub-list', props.class]">
    <Skeleton v-if="state.status === 'idle' || state.status === 'loading'" :rows="3" />
    <ErrorState
      v-else-if="state.status === 'error'"
      :error="state.error"
      :on-retry="() => dispatch({ type: 'refresh' })"
      :retry-label="messages['common.retry']"
    />
    <EmptyState v-else-if="state.subscriptions.length === 0" :message="messages['subscriptions.empty']" />
    <div
      v-else
      :style="{ display: 'flex', flexDirection: 'column', gap: 'var(--monigo-space-3)' }"
    >
      <SubscriptionCard
        v-for="sub in state.subscriptions"
        :key="sub.id"
        :subscription="sub"
      />
    </div>
  </div>
</template>
