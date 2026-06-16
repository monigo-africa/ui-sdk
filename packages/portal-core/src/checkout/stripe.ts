import { loadScript } from './loadScript'
import type { CheckoutAdapter, CheckoutResult } from './types'

// Stripe's canonical loader URL has no .js suffix — do not "correct" it.
const SCRIPT = 'https://js.stripe.com/v3'

export const stripeAdapter: CheckoutAdapter = {
  async launch(session, opts): Promise<CheckoutResult> {
    if (!opts.mountEl) throw new Error('Stripe embedded checkout requires a mount element')
    if (!session.client_secret) throw new Error('Stripe session missing client_secret')
    await loadScript(SCRIPT)
    const Stripe = (globalThis as Record<string, unknown>).Stripe as
      | ((key: string) => {
          initEmbeddedCheckout: (o: {
            clientSecret: string
            onComplete?: () => void
          }) => Promise<{ mount: (el: HTMLElement) => void; destroy: () => void }>
        })
      | undefined
    if (!Stripe) throw new Error('Stripe.js did not load')
    const stripe = Stripe(session.public_key)

    let checkout: { mount: (el: HTMLElement) => void; destroy: () => void } | undefined
    try {
      return await new Promise<CheckoutResult>((resolve, reject) => {
        const signal = opts.signal
        if (signal?.aborted) {
          resolve({ status: 'closed', reference: session.reference })
          return
        }
        signal?.addEventListener(
          'abort',
          () => resolve({ status: 'closed', reference: session.reference }),
          { once: true },
        )
        stripe
          .initEmbeddedCheckout({
            clientSecret: session.client_secret as string,
            onComplete: () => resolve({ status: 'success', reference: session.reference }),
          })
          .then((c) => {
            checkout = c
            c.mount(opts.mountEl as HTMLElement)
          })
          .catch((err: unknown) => reject(err instanceof Error ? err : new Error(String(err))))
      })
    } finally {
      checkout?.destroy()
    }
  },
}
