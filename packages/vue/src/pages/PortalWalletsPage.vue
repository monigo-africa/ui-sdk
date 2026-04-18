<script setup lang="ts">
import type { PortalWallet } from '@monigo/portal-core'
import { useMonigoContext } from '../provider/context'
import WalletList from '../components/WalletList.vue'

interface Props { class?: string }
const props = withDefaults(defineProps<Props>(), { class: '' })
const emit = defineEmits<{ walletClick: [wallet: PortalWallet] }>()

const { messages } = useMonigoContext()
</script>

<template>
  <section :class="['monigo-page', props.class]">
    <h1 :style="{ fontSize: 'var(--monigo-text-2xl)', marginBottom: 'var(--monigo-space-5)' }">{{ messages['wallets.title'] }}</h1>
    <WalletList @wallet-click="(wallet) => emit('walletClick', wallet)" />
  </section>
</template>
