<script setup lang="ts">
import WalletDetail from '../components/WalletDetail.vue'
import WalletTransactionList from '../components/WalletTransactionList.vue'

interface Props {
  walletId: string
  class?: string
}
const props = withDefaults(defineProps<Props>(), { class: '' })
</script>

<template>
  <section :class="['monigo-page', props.class]">
    <WalletDetail :wallet-id="props.walletId" />
    <WalletTransactionList :wallet-id="props.walletId" :style="{ marginTop: 'var(--monigo-space-5)' }" />
  </section>
</template>
