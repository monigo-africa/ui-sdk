// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Stub the script loader so adapters resolve without network.
vi.mock('./loadScript', () => ({ loadScript: vi.fn(async () => {}) }))

import { launchCheckout } from './index'
import type { FundingSession } from '../types'

function session(overrides: Partial<FundingSession>): FundingSession {
  return {
    provider: 'paystack',
    reference: 'wf_1',
    amount: '5000.00',
    currency: 'NGN',
    email: 'c@example.com',
    customer_name: 'Jane',
    public_key: 'pk_test',
    meta: {},
    ...overrides,
  }
}

beforeEach(() => {
  ;(globalThis as Record<string, unknown>).PaystackPop = undefined
  ;(globalThis as Record<string, unknown>).FlutterwaveCheckout = undefined
  ;(globalThis as Record<string, unknown>).MonnifySDK = undefined
  ;(globalThis as Record<string, unknown>).Stripe = undefined
})

describe('launchCheckout', () => {
  it('paystack resolves success via resumeTransaction onSuccess', async () => {
    ;(globalThis as Record<string, unknown>).PaystackPop = class {
      resumeTransaction(_code: string, cbs: { onSuccess: () => void }) { cbs.onSuccess() }
    }
    const res = await launchCheckout(session({ provider: 'paystack', access_code: 'ac_1' }))
    expect(res).toEqual({ status: 'success', reference: 'wf_1' })
  })

  it('flutterwave resolves success via callback', async () => {
    ;(globalThis as Record<string, unknown>).FlutterwaveCheckout = (opts: { callback: (d: { tx_ref: string }) => void }) => opts.callback({ tx_ref: 'wf_1' })
    const res = await launchCheckout(session({ provider: 'flutterwave' }))
    expect(res.status).toBe('success')
  })

  it('monnify resolves closed via onClose', async () => {
    ;(globalThis as Record<string, unknown>).MonnifySDK = {
      initialize: (opts: { onClose: () => void }) => opts.onClose(),
    }
    const res = await launchCheckout(session({ provider: 'monnify', contract_code: 'CC1' }))
    expect(res.status).toBe('closed')
  })

  it('throws for an unknown provider', async () => {
    await expect(
      launchCheckout(session({ provider: 'unknown' as unknown as FundingSession['provider'] })),
    ).rejects.toThrow('No checkout adapter')
  })

  it('paystack resolves closed via onCancel', async () => {
    ;(globalThis as Record<string, unknown>).PaystackPop = class {
      resumeTransaction(_c: string, cbs: { onCancel: () => void }) { cbs.onCancel() }
    }
    const res = await launchCheckout(session({ provider: 'paystack', access_code: 'ac_1' }))
    expect(res.status).toBe('closed')
  })

  it('paystack resolves failed via onError', async () => {
    ;(globalThis as Record<string, unknown>).PaystackPop = class {
      resumeTransaction(_c: string, cbs: { onError: () => void }) { cbs.onError() }
    }
    const res = await launchCheckout(session({ provider: 'paystack', access_code: 'ac_1' }))
    expect(res.status).toBe('failed')
  })

  it('paystack throws when the global is missing', async () => {
    await expect(launchCheckout(session({ provider: 'paystack', access_code: 'ac_1' })))
      .rejects.toThrow('Paystack inline script did not load')
  })

  it('paystack throws when access_code is missing', async () => {
    ;(globalThis as Record<string, unknown>).PaystackPop = class {
      resumeTransaction() {}
    }
    await expect(launchCheckout(session({ provider: 'paystack' })))
      .rejects.toThrow('missing access_code')
  })

  it('stripe mounts and resolves success on complete', async () => {
    ;(globalThis as Record<string, unknown>).Stripe = (_k: string) => ({
      initEmbeddedCheckout: async (o: { onComplete?: () => void }) => ({
        mount: () => o.onComplete?.(),
        destroy: () => {},
      }),
    })
    const el = document.createElement('div')
    const res = await launchCheckout(
      session({ provider: 'stripe', client_secret: 'cs_secret', public_key: 'pk' }),
      { mountEl: el },
    )
    expect(res.status).toBe('success')
  })

  it('stripe throws without a mount element', async () => {
    await expect(launchCheckout(session({ provider: 'stripe', client_secret: 'cs' }), {}))
      .rejects.toThrow('mount element')
  })

  it('stripe resolves closed when the signal aborts', async () => {
    let onComplete: (() => void) | undefined
    ;(globalThis as Record<string, unknown>).Stripe = (_k: string) => ({
      initEmbeddedCheckout: async (o: { onComplete?: () => void }) => {
        onComplete = o.onComplete
        return { mount: () => {}, destroy: () => {} }
      },
    })
    const controller = new AbortController()
    const el = document.createElement('div')
    const p = launchCheckout(
      session({ provider: 'stripe', client_secret: 'cs', public_key: 'pk' }),
      { mountEl: el, signal: controller.signal },
    )
    // give the async init a tick to register, then abort (simulating modal close)
    await Promise.resolve()
    controller.abort()
    const res = await p
    expect(res.status).toBe('closed')
    void onComplete
  })
})
