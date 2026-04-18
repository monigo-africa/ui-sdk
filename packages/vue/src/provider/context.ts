import { inject, provide, type InjectionKey } from 'vue'
import type { PortalClient, MessageCatalog } from '@monigo/portal-core'

export interface MonigoTheme {
  primary: string
  accent: string
  mode: 'light' | 'dark' | 'auto'
  radius?: 'sm' | 'md' | 'lg'
  font?: string
}

export interface MonigoContext {
  client: PortalClient
  messages: MessageCatalog
  locale: string
  theme: MonigoTheme
  onUnauthorized?: () => void
  onError?: (err: unknown) => void
}

export const MONIGO_CONTEXT_KEY: InjectionKey<MonigoContext> = Symbol('monigo.context')

export function provideMonigoContext(ctx: MonigoContext): void {
  provide(MONIGO_CONTEXT_KEY, ctx)
}

export function useMonigoContext(): MonigoContext {
  const ctx = inject(MONIGO_CONTEXT_KEY)
  if (!ctx) {
    throw new Error(
      '@monigo/vue: no <MonigoProvider> ancestor found. Wrap your app in <MonigoProvider portalToken="..." />.',
    )
  }
  return ctx
}
