import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import React from 'react'
import { MonigoReactContext, useMonigoContext, createMonigoContext } from './context'
import { PortalClient, createMessages } from '@monigo/portal-core'

const makeClient = () =>
  new PortalClient({ portalToken: 'test', fetch: (async () => new Response('{}')) as typeof fetch })

describe('createMonigoContext', () => {
  it('builds a context object with client, messages, locale, and theme', () => {
    const client = makeClient()
    const ctx = createMonigoContext({
      client,
      messages: createMessages(),
      locale: 'en-US',
      theme: { primary: '#4f46e5', accent: '#ec4899', mode: 'light' },
    })
    expect(ctx.client).toBe(client)
    expect(ctx.messages['invoices.title']).toBe('Invoices')
    expect(ctx.theme.primary).toBe('#4f46e5')
    expect(ctx.locale).toBe('en-US')
  })
})

describe('useMonigoContext', () => {
  it('throws when used outside a MonigoProvider', () => {
    expect(() =>
      renderHook(() => useMonigoContext())
    ).toThrow('@monigo/react')
  })

  it('returns the context when provided', () => {
    const client = makeClient()
    const ctx = createMonigoContext({
      client,
      messages: createMessages(),
      locale: 'en-US',
      theme: { primary: '#4f46e5', accent: '#ec4899', mode: 'light' },
    })
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(MonigoReactContext.Provider, { value: ctx }, children)
    const { result } = renderHook(() => useMonigoContext(), { wrapper })
    expect(result.current.client).toBe(client)
  })
})
