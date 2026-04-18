<script setup lang="ts">
import { computed, watchEffect, onMounted, onUnmounted } from 'vue'
import { PortalClient, createMessages, type MessageCatalog } from '@monigo/portal-core'
import { createTheme, type ThemeOptions } from '@monigo/tokens'
import { provideMonigoContext, type MonigoTheme, type MonigoContext } from './context'

interface Props {
  portalToken: string
  baseUrl?: string
  fetch?: typeof globalThis.fetch
  theme?: Partial<MonigoTheme>
  locale?: string
  messages?: Partial<MessageCatalog>
  onUnauthorized?: () => void
  onError?: (err: unknown) => void
}

const props = withDefaults(defineProps<Props>(), { locale: 'en-US' })

const resolvedTheme = computed<MonigoTheme>(() => ({
  primary: props.theme?.primary ?? '#4f46e5',
  accent: props.theme?.accent ?? '#ec4899',
  mode: props.theme?.mode ?? 'auto',
  ...(props.theme?.radius !== undefined && { radius: props.theme.radius }),
  ...(props.theme?.font !== undefined && { font: props.theme.font }),
}))

// Reconstruct the client only when token or baseUrl changes.
// props.fetch is intentionally not a dependency to avoid churn on inline fns.
const client = computed(
  () =>
    new PortalClient({
      portalToken: props.portalToken,
      ...(props.baseUrl !== undefined && { baseUrl: props.baseUrl }),
      ...(props.fetch !== undefined && { fetch: props.fetch }),
    }),
)

const messages = computed(() => createMessages(props.locale, props.messages))

const ctx = computed<MonigoContext>(() => ({
  client: client.value,
  messages: messages.value,
  locale: props.locale,
  theme: resolvedTheme.value,
  ...(props.onUnauthorized !== undefined && { onUnauthorized: props.onUnauthorized }),
  ...(props.onError !== undefined && { onError: props.onError }),
}))

// Provide plain (unwrapped) context so consumers don't need .value
provideMonigoContext(ctx.value)

// Re-provide when ctx changes (Vue's provide is reactive if given a reactive value,
// but since we unwrap, we need watchEffect to keep it fresh)
watchEffect(() => {
  provideMonigoContext(ctx.value)
})

// Theme CSS injection
let styleEl: HTMLStyleElement | null = null

const buildThemeOptions = (): ThemeOptions => ({
  primary: resolvedTheme.value.primary,
  accent: resolvedTheme.value.accent,
  mode: resolvedTheme.value.mode,
  ...(resolvedTheme.value.radius !== undefined && { radius: resolvedTheme.value.radius }),
  ...(resolvedTheme.value.font !== undefined && { font: resolvedTheme.value.font }),
})

onMounted(() => {
  styleEl = document.createElement('style')
  styleEl.setAttribute('data-monigo', 'theme')
  styleEl.textContent = createTheme(buildThemeOptions())
  document.head.appendChild(styleEl)
})

watchEffect(() => {
  if (styleEl) {
    styleEl.textContent = createTheme(buildThemeOptions())
  }
})

onUnmounted(() => {
  styleEl?.remove()
  styleEl = null
})

const resolvedMode = computed<'light' | 'dark'>(() => {
  if (resolvedTheme.value.mode !== 'auto') return resolvedTheme.value.mode
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
})
</script>

<template>
  <div
    :data-monigo-theme="resolvedMode"
    style="color: var(--monigo-color-fg); background: var(--monigo-color-bg); font-family: var(--monigo-font-sans);"
  >
    <slot />
  </div>
</template>
