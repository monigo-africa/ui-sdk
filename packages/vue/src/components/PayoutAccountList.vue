<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useMonigoContext } from '../provider/context'
import { usePayoutAccounts } from '../stores/usePayoutAccounts'
import PayoutAccountCard from './PayoutAccountCard.vue'
import Skeleton from './shared/Skeleton.vue'
import EmptyState from './shared/EmptyState.vue'
import ErrorState from './shared/ErrorState.vue'

interface Props { class?: string }
const props = withDefaults(defineProps<Props>(), { class: '' })

const { client, messages } = useMonigoContext()
const { state, dispatch, dispose } = usePayoutAccounts(client)

onMounted(() => dispatch({ type: 'load' }))
onUnmounted(dispose)
</script>

<template>
  <div :class="['monigo-payout-account-list', props.class]">
    <Skeleton v-if="state.status === 'idle' || state.status === 'loading'" :rows="3" />
    <ErrorState
      v-else-if="state.status === 'error'"
      :error="state.error"
      :on-retry="() => dispatch({ type: 'refresh' })"
      :retry-label="messages['common.retry']"
    />
    <EmptyState v-else-if="state.payoutAccounts.length === 0" :message="messages['payout_accounts.empty']" />
    <div
      v-else
      :style="{ display: 'flex', flexDirection: 'column', gap: 'var(--monigo-space-3)' }"
    >
      <PayoutAccountCard
        v-for="account in state.payoutAccounts"
        :key="account.id"
        :account="account"
      />
    </div>
  </div>
</template>
