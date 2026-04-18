import React, { useMemo, useEffect, useRef } from 'react'
import { PortalClient, createMessages, type MessageCatalog } from '@monigo/portal-core'
import { createTheme } from '@monigo/tokens'
import { MonigoReactContext, createMonigoContext, type MonigoTheme } from './context'

export interface MonigoProviderProps {
  portalToken: string
  baseUrl?: string
  fetch?: typeof globalThis.fetch
  theme?: Partial<MonigoTheme>
  locale?: string
  messages?: Partial<MessageCatalog>
  onUnauthorized?: () => void
  onError?: (err: unknown) => void
  children: React.ReactNode
}

export function MonigoProvider({
  portalToken,
  baseUrl,
  fetch: fetchImpl,
  theme: themeInput,
  locale = 'en-US',
  messages: messageOverrides,
  onUnauthorized,
  onError,
  children,
}: MonigoProviderProps): React.ReactElement {
  const client = useMemo(
    () =>
      new PortalClient({
        portalToken,
        ...(baseUrl !== undefined && { baseUrl }),
        ...(fetchImpl !== undefined && { fetch: fetchImpl }),
      }),
    // Reconstruct only when the token or baseUrl changes. fetchImpl is
    // intentionally excluded to avoid churn when callers pass an inline fn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [portalToken, baseUrl],
  )

  const theme: MonigoTheme = useMemo(
    () => ({
      primary: themeInput?.primary ?? '#4f46e5',
      accent: themeInput?.accent ?? '#ec4899',
      mode: themeInput?.mode ?? 'auto',
      ...(themeInput?.radius !== undefined && { radius: themeInput.radius }),
      ...(themeInput?.font !== undefined && { font: themeInput.font }),
    }),
    // Spread comparison is fine for these scalar theme props.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [themeInput?.primary, themeInput?.accent, themeInput?.mode, themeInput?.radius, themeInput?.font],
  )

  const messages = useMemo(
    () => createMessages(locale, messageOverrides),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  )

  const ctx = useMemo(
    () =>
      createMonigoContext({
        client,
        messages,
        locale,
        theme,
        ...(onUnauthorized !== undefined && { onUnauthorized }),
        ...(onError !== undefined && { onError }),
      }),
    [client, messages, locale, theme, onUnauthorized, onError],
  )

  // Inject theme CSS into document.head as a <style> tag.
  const styleRef = useRef<HTMLStyleElement | null>(null)
  useEffect(() => {
    const css = createTheme({
      primary: theme.primary,
      accent: theme.accent,
      mode: theme.mode,
      ...(theme.radius && { radius: theme.radius }),
      ...(theme.font && { font: theme.font }),
    })
    if (!styleRef.current) {
      const el = document.createElement('style')
      el.setAttribute('data-monigo', 'theme')
      document.head.appendChild(el)
      styleRef.current = el
    }
    styleRef.current.textContent = css
    return () => {
      styleRef.current?.remove()
      styleRef.current = null
    }
  }, [theme])

  const resolvedMode: 'light' | 'dark' =
    theme.mode === 'auto'
      ? typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme.mode

  return (
    <MonigoReactContext.Provider value={ctx}>
      <div
        data-monigo-theme={resolvedMode}
        style={{
          color: 'var(--monigo-color-fg)',
          background: 'var(--monigo-color-bg)',
          fontFamily: 'var(--monigo-font-sans)',
        }}
      >
        {children}
      </div>
    </MonigoReactContext.Provider>
  )
}
