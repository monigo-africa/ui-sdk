<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import type { PortalWallet } from '@monigo/portal-core'
import { useMonigoContext } from '../provider/context'
import { useWallets } from '../stores/useWallets'
import WalletCard from './WalletCard.vue'
import Skeleton from './shared/Skeleton.vue'
import EmptyState from './shared/EmptyState.vue'
import ErrorState from './shared/ErrorState.vue'

interface Props { class?: string }
const props = withDefaults(defineProps<Props>(), { class: '' })
const emit = defineEmits<{ walletClick: [wallet: PortalWallet] }>()

const { client, messages } = useMonigoContext()
const { state, dispatch, dispose } = useWallets(client)

onMounted(() => dispatch({ type: 'load' }))
onUnmounted(dispose)
</script>

<template>
  <div :class="['monigo-wallet-list', props.class]">
    <Skeleton v-if="state.status === 'idle' || state.status === 'loading'" :rows="3" />
    <ErrorState
      v-else-if="state.status === 'error'"
      :error="state.error"
      :on-retry="() => dispatch({ type: 'refresh' })"
      :retry-label="messages['common.retry']"
    />
    <EmptyState v-else-if="state.wallets.length === 0" :message="messages['wallets.empty']" />
    <div
      v-else
      :style="{ display: 'flex', flexDirection: 'column', gap: 'var(--monigo-space-3)' }"
    >
      <WalletCard
        v-for="wallet in state.wallets"
        :key="wallet.id"
        :wallet="wallet"
        @wallet-click="(w) => emit('walletClick', w)"
      />
    </div>
  </div>
</template>
