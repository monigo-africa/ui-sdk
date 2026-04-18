<script setup lang="ts">
import InvoiceDetail from '../components/InvoiceDetail.vue'

interface Props {
  invoiceId: string
  class?: string
}
const props = withDefaults(defineProps<Props>(), { class: '' })
</script>

<template>
  <InvoiceDetail :invoice-id="props.invoiceId" :class="props.class" />
</template>
