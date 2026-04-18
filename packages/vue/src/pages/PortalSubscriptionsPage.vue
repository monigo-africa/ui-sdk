<script setup lang="ts">
import { useMonigoContext } from '../provider/context'
import SubscriptionList from '../components/SubscriptionList.vue'

interface Props { class?: string }
const props = withDefaults(defineProps<Props>(), { class: '' })

const { messages } = useMonigoContext()
</script>

<template>
  <section :class="['monigo-page', props.class]">
    <h1 :style="{ fontSize: 'var(--monigo-text-2xl)', marginBottom: 'var(--monigo-space-5)' }">{{ messages['subscriptions.title'] }}</h1>
    <SubscriptionList />
  </section>
</template>
