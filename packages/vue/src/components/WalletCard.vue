<script setup lang="ts">
import { formatCurrency } from '@monigo/portal-core'
import type { PortalWallet } from '@monigo/portal-core'
import { useMonigoContext } from '../provider/context'

interface Props {
  wallet: PortalWallet
  class?: string
}
const props = withDefaults(defineProps<Props>(), { class: '' })
const emit = defineEmits<{ walletClick: [wallet: PortalWallet] }>()

const { locale } = useMonigoContext()
</script>

<template>
  <div
    :class="['monigo-wallet-card', props.class]"
    :style="{
      padding: 'var(--monigo-space-4)',
      border: '1px solid var(--monigo-color-border)',
      borderRadius: 'var(--monigo-radius-md)',
      cursor: 'pointer',
    }"
    tabindex="0"
    role="button"
    @click="emit('walletClick', props.wallet)"
    @keydown.enter="emit('walletClick', props.wallet)"
  >
    <div :style="{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--monigo-space-2)' }">
      <span :style="{ fontWeight: '600', fontSize: 'var(--monigo-text-md)' }">
        {{ props.wallet.currency }} Wallet
      </span>
      <span
        :style="{
          fontSize: 'var(--monigo-text-xs)',
          color: props.wallet.status === 'active' ? 'var(--monigo-color-success)' : 'var(--monigo-color-muted-fg)',
        }"
      >
        {{ props.wallet.status }}
      </span>
    </div>
    <p :style="{ fontSize: 'var(--monigo-text-xl)', fontWeight: '700', margin: '0' }">
      {{ formatCurrency(props.wallet.balance, props.wallet.currency, locale) }}
    </p>
  </div>
</template>
