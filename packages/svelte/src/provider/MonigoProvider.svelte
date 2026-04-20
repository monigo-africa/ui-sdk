<script lang="ts">
  import { PortalClient, createMessages, type MessageCatalog } from '@monigo/portal-core'
  import { createTheme } from '@monigo/tokens'
  import { setMonigoContext, type MonigoTheme } from './context'
  import type { Snippet } from 'svelte'

  interface Props {
    portalToken: string
    baseUrl?: string
    fetch?: typeof globalThis.fetch
    theme?: Partial<MonigoTheme>
    locale?: string
    messages?: Partial<MessageCatalog>
    onUnauthorized?: () => void
    onError?: (err: unknown) => void
    children: Snippet
  }

  const {
    portalToken,
    baseUrl,
    fetch,
    theme: themeInput,
    locale = 'en-US',
    messages: messageOverrides,
    onUnauthorized,
    onError,
    children,
  }: Props = $props()

  const theme = $derived<MonigoTheme>({
    primary: themeInput?.primary ?? '#4f46e5',
    accent: themeInput?.accent ?? '#ec4899',
    mode: themeInput?.mode ?? 'auto',
    ...(themeInput?.radius !== undefined && { radius: themeInput.radius }),
    ...(themeInput?.font !== undefined && { font: themeInput.font }),
  })

  const client = $derived(new PortalClient({
    portalToken,
    ...(baseUrl !== undefined && { baseUrl }),
    ...(fetch !== undefined && { fetch }),
  }))

  const messages = $derived(createMessages(locale, messageOverrides))

  // Context MUST be set during component initialization (synchronously in <script>).
  // Svelte initializes children's scripts after this parent's script but BEFORE
  // $effect runs, so setting context inside $effect leaves children throwing
  // "no MonigoProvider ancestor found" on their first getMonigoContext() read.
  // Getters forward live $derived/$props values so child reads stay reactive.
  setMonigoContext({
    get client() { return client },
    get messages() { return messages },
    get locale() { return locale },
    get theme() { return theme },
    get onUnauthorized() { return onUnauthorized },
    get onError() { return onError },
  })

  const themeCSS = $derived(createTheme({
    primary: theme.primary,
    accent: theme.accent,
    mode: theme.mode,
    ...(theme.radius && { radius: theme.radius }),
    ...(theme.font && { font: theme.font }),
  }))

  const resolvedMode = $derived.by(() => {
    if (theme.mode !== 'auto') return theme.mode
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
    return 'light'
  })
</script>

<svelte:head>
  {@html `<style>${themeCSS}</style>`}
</svelte:head>

<div data-monigo-theme={resolvedMode} class="monigo-root">
  {@render children()}
</div>

<style>
  .monigo-root {
    color: var(--monigo-color-fg);
    background: var(--monigo-color-bg);
    font-family: var(--monigo-font-sans);
  }
</style>
