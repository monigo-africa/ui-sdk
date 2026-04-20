import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import ProviderWithConsumer from './fixtures/ProviderWithConsumer.svelte'
import type { MonigoContext } from '../src/provider/context'

// Regression test for the customer portal failing to mount with
// "no MonigoProvider ancestor found". The bug was that MonigoProvider
// called setMonigoContext inside $effect, which runs AFTER children
// initialize — so every child reading getMonigoContext() in its
// <script> block threw on first render. The contract we assert here:
// by the time a direct child's <script> runs, the context must be
// readable.
describe('MonigoProvider mount-time context', () => {
  it('is readable from a child during the child\'s script execution', () => {
    let capturedCtx: MonigoContext | null = null
    let capturedErr: unknown = undefined

    render(ProviderWithConsumer, {
      props: {
        portalToken: 'regression-token',
        onReady: (ctx, err) => {
          capturedCtx = ctx
          capturedErr = err
        },
      },
    })

    expect(capturedErr).toBeUndefined()
    expect(capturedCtx).not.toBeNull()
    const ctx = capturedCtx as unknown as MonigoContext
    expect(ctx.client).toBeDefined()
    expect(ctx.messages['invoices.title']).toBe('Invoices')
    expect(ctx.locale).toBe('en-US')
    expect(ctx.theme.primary).toBe('#4f46e5')
  })
})
