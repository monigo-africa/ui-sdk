import { describe, it, expect } from 'vitest'
import { defineComponent, provide, h } from 'vue'
import { mount } from '@vue/test-utils'
import { MONIGO_CONTEXT_KEY, provideMonigoContext, useMonigoContext } from './context'
import { PortalClient, createMessages } from '@monigo/portal-core'

const makeClient = () =>
  new PortalClient({ portalToken: 'test', fetch: (async () => new Response('{}')) as typeof fetch })

describe('provideMonigoContext + useMonigoContext', () => {
  it('injects and retrieves context inside a provider tree', () => {
    const client = makeClient()
    const messages = createMessages()
    const theme = { primary: '#4f46e5', accent: '#ec4899', mode: 'light' as const }

    let capturedCtx: ReturnType<typeof useMonigoContext> | null = null

    const Child = defineComponent({
      setup() {
        capturedCtx = useMonigoContext()
        return () => h('span', 'ok')
      },
    })

    const Parent = defineComponent({
      setup() {
        provideMonigoContext({ client, messages, locale: 'en-US', theme })
        return () => h(Child)
      },
    })

    mount(Parent)

    expect(capturedCtx!.client).toBe(client)
    expect(capturedCtx!.messages['invoices.title']).toBe('Invoices')
    expect(capturedCtx!.theme.primary).toBe('#4f46e5')
    expect(capturedCtx!.locale).toBe('en-US')
  })

  it('throws when used outside a MonigoProvider', () => {
    const Bad = defineComponent({
      setup() {
        expect(() => useMonigoContext()).toThrow('@monigo/vue')
        return () => h('span', 'bad')
      },
    })
    mount(Bad)
  })
})
