import { describe, it, expect } from 'vitest'
import { createMonigoContext, MONIGO_CONTEXT_KEY } from './context'
import { PortalClient, createMessages } from '@monigo/portal-core'

describe('createMonigoContext', () => {
  it('builds a context object with client, messages, and theme', () => {
    const client = new PortalClient({ portalToken: 't', fetch: (async () => new Response('{}')) as typeof fetch })
    const ctx = createMonigoContext({
      client,
      messages: createMessages(),
      locale: 'en-US',
      theme: { primary: '#111', accent: '#222', mode: 'light' },
    })
    expect(ctx.client).toBe(client)
    expect(ctx.messages['invoices.title']).toBe('Invoices')
    expect(ctx.theme.primary).toBe('#111')
    expect(ctx.locale).toBe('en-US')
  })

  it('exports a stable context key', () => {
    expect(typeof MONIGO_CONTEXT_KEY).toBe('symbol')
  })
})
