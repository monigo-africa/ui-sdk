import { createContext, useContext } from 'react'
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

export const MonigoReactContext = createContext<MonigoContext | null>(null)

export function useMonigoContext(): MonigoContext {
  const ctx = useContext(MonigoReactContext)
  if (!ctx) {
    throw new Error(
      '@monigo/react: no MonigoProvider ancestor found. Wrap your app in <MonigoProvider portalToken="..." />.',
    )
  }
  return ctx
}
