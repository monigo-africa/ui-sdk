<script setup lang="ts">
import type { CustomerPayoutAccount } from '@monigo/portal-core'

interface Props {
  account: CustomerPayoutAccount
  class?: string
}
const props = withDefaults(defineProps<Props>(), { class: '' })

const maskedAccount = (account: CustomerPayoutAccount): string => {
  const num = account.account_number ?? account.mobile_money_number
  if (!num) return '—'
  return `••••${num.slice(-4)}`
}
</script>

<template>
  <div
    :class="['monigo-payout-account-card', props.class]"
    :style="{
      padding: 'var(--monigo-space-4)',
      border: '1px solid var(--monigo-color-border)',
      borderRadius: 'var(--monigo-radius-md)',
    }"
  >
    <div :style="{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--monigo-space-2)' }">
      <span :style="{ fontWeight: '500', fontSize: 'var(--monigo-text-sm)' }">
        {{ props.account.bank_name ?? props.account.payout_method }}
      </span>
      <span :style="{ fontSize: 'var(--monigo-text-xs)', color: 'var(--monigo-color-muted-fg)' }">
        {{ props.account.currency }}
      </span>
    </div>
    <p :style="{ margin: '0', fontSize: 'var(--monigo-text-sm)', color: 'var(--monigo-color-muted-fg)' }">
      {{ maskedAccount(props.account) }}
      <span v-if="props.account.account_name"> — {{ props.account.account_name }}</span>
    </p>
    <span
      v-if="props.account.is_default"
      :style="{
        display: 'inline-block',
        marginTop: 'var(--monigo-space-2)',
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
