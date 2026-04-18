<script setup lang="ts">
import type { PortalInvoice } from '@monigo/portal-core'
import { useMonigoContext } from '../provider/context'
import InvoiceList from '../components/InvoiceList.vue'

interface Props { class?: string }
const props = withDefaults(defineProps<Props>(), { class: '' })
const emit = defineEmits<{ invoiceClick: [inv: PortalInvoice] }>()

const { messages } = useMonigoContext()
</script>

<template>
  <section :class="['monigo-page', props.class]">
    <h1 :style="{ fontSize: 'var(--monigo-text-2xl)', marginBottom: 'var(--monigo-space-5)' }">{{ messages['invoices.title'] }}</h1>
    <InvoiceList @invoice-click="(inv) => emit('invoiceClick', inv)" />
  </section>
</template>
