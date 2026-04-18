<script setup lang="ts">
import BillDetail from '../components/BillDetail.vue'

interface Props {
  billId: string
  class?: string
}
const props = withDefaults(defineProps<Props>(), { class: '' })
</script>

<template>
  <BillDetail :bill-id="props.billId" :class="props.class" />
</template>
