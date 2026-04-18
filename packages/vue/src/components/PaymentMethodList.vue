<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useMonigoContext } from '../provider/context'
import { usePaymentMethods } from '../stores/usePaymentMethods'
import PaymentMethodCard from './PaymentMethodCard.vue'
import RemovePaymentMethodButton from './RemovePaymentMethodButton.vue'
import SetDefaultPaymentMethodButton from './SetDefaultPaymentMethodButton.vue'
import Skeleton from './shared/Skeleton.vue'
import EmptyState from './shared/EmptyState.vue'
import ErrorState from './shared/ErrorState.vue'

interface Props { class?: string }
const props = withDefaults(defineProps<Props>(), { class: '' })

const { client, messages } = useMonigoContext()
const { state, dispatch, dispose } = usePaymentMethods(client)

onMounted(() => dispatch({ type: 'load' }))
onUnmounted(dispose)

const refresh = () => dispatch({ type: 'refresh' })
</script>

<template>
  <div :class="['monigo-pm-list', props.class]">
    <Skeleton v-if="state.status === 'idle' || state.status === 'loading'" :rows="3" />
    <ErrorState
      v-else-if="state.status === 'error'"
      :error="state.error"
      :on-retry="() => dispatch({ type: 'refresh' })"
      :retry-label="messages['common.retry']"
    />
    <EmptyState v-else-if="state.paymentMethods.length === 0" :message="messages['payment_methods.empty']" />
    <div
      v-else
      :style="{ display: 'flex', flexDirection: 'column', gap: 'var(--monigo-space-3)' }"
    >
      <div
        v-for="method in state.paymentMethods"
        :key="method.id"
        :style="{ display: 'flex', alignItems: 'center', gap: 'var(--monigo-space-2)' }"
      >
        <PaymentMethodCard :method="method" :style="{ flex: '1' }" />
        <div :style="{ display: 'flex', gap: 'var(--monigo-space-2)' }">
          <SetDefaultPaymentMethodButton
            v-if="!method.is_default"
            :payment-method-id="method.id"
            @set="refresh"
          />
          <RemovePaymentMethodButton
            :payment-method-id="method.id"
            @remove="refresh"
          />
        </div>
      </div>
    </div>
  </div>
</template>
