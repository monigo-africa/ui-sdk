import type { PortalClient, MessageCatalog } from '@monigo/portal-core'
import { getContext, setContext } from 'svelte'

export const MONIGO_CONTEXT_KEY = Symbol('monigo.context')

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
  onUnauthorized?: (() => void) | undefined
  onError?: ((err: unknown) => void) | undefined
}

export interface MonigoContextInit {
  client: PortalClient
  messages: MessageCatalog
  locale: string
  theme: MonigoTheme
  onUnauthorized?: () => void
  onError?: (err: unknown) => void
}

export function createMonigoContext(init: MonigoContextInit): MonigoContext {
  return init
}

export function setMonigoContext(ctx: MonigoContext): void {
  setContext(MONIGO_CONTEXT_KEY, ctx)
}

export function getMonigoContext(): MonigoContext {
  const ctx = getContext<MonigoContext | undefined>(MONIGO_CONTEXT_KEY)
  if (!ctx) {
    throw new Error(
      '@monigo/svelte: no MonigoProvider ancestor found. Wrap your app in <MonigoProvider portalToken="..." />.',
    )
  }
  return ctx
}
