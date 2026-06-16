import { loadScript } from './loadScript'
import type { CheckoutAdapter, CheckoutResult } from './types'

const SCRIPT = 'https://checkout.flutterwave.com/v3.js'

export const flutterwaveAdapter: CheckoutAdapter = {
  async launch(session): Promise<CheckoutResult> {
    await loadScript(SCRIPT)
    const FlutterwaveCheckout = (globalThis as Record<string, unknown>).FlutterwaveCheckout as
      | ((opts: Record<string, unknown>) => void)
      | undefined
    if (!FlutterwaveCheckout) throw new Error('Flutterwave checkout did not load')
    const amount = Number(session.amount)
    if (Number.isNaN(amount)) throw new Error(`Invalid amount: ${session.amount}`)
    return new Promise<CheckoutResult>((resolve) => {
      FlutterwaveCheckout({
        public_key: session.public_key,
        tx_ref: session.reference,
        amount,
        currency: session.currency,
        customer: { email: session.email, name: session.customer_name },
        meta: session.meta,
        callback: (data?: { tx_ref?: string }) =>
          resolve({ status: 'success', reference: data?.tx_ref ?? session.reference }),
        onclose: () => resolve({ status: 'closed', reference: session.reference }),
      })
    })
  },
}
