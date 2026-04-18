<script setup lang="ts">
import type { Bill } from '@monigo/portal-core'
import { useMonigoContext } from '../provider/context'
import BillList from '../components/BillList.vue'

interface Props { class?: string }
const props = withDefaults(defineProps<Props>(), { class: '' })
const emit = defineEmits<{ billClick: [bill: Bill] }>()

const { messages } = useMonigoContext()
</script>

<template>
  <section :class="['monigo-page', props.class]">
    <h1 :style="{ fontSize: 'var(--monigo-text-2xl)', marginBottom: 'var(--monigo-space-5)' }">{{ messages['bills.title'] }}</h1>
    <BillList @bill-click="(bill) => emit('billClick', bill)" />
  </section>
</template>
