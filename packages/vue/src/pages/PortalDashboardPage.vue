<script setup lang="ts">
import type { PortalInvoice, Bill } from '@monigo/portal-core'
import DashboardSummary from '../components/DashboardSummary.vue'
import RecentActivity from '../components/RecentActivity.vue'

interface Props { class?: string }
const props = withDefaults(defineProps<Props>(), { class: '' })
const emit = defineEmits<{
  invoiceClick: [inv: PortalInvoice]
  billClick: [bill: Bill]
}>()
</script>

<template>
  <section :class="['monigo-page', props.class]">
    <DashboardSummary />
    <RecentActivity
      @invoice-click="(inv) => emit('invoiceClick', inv)"
      @bill-click="(bill) => emit('billClick', bill)"
    />
  </section>
</template>
