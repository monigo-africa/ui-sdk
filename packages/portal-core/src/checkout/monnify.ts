import { loadScript } from './loadScript'
import type { CheckoutAdapter, CheckoutResult } from './types'

const SCRIPT = 'https://sdk.monnify.com/plugin/monnify.js'

export const monnifyAdapter: CheckoutAdapter = {
  async launch(session): Promise<CheckoutResult> {
    await loadScript(SCRIPT)
    const MonnifySDK = (globalThis as Record<string, unknown>).MonnifySDK as
      | { initialize: (opts: Record<string, unknown>) => void }
      | undefined
    if (!MonnifySDK) throw new Error('Monnify SDK did not load')
    const amount = Number(session.amount)
    if (Number.isNaN(amount)) throw new Error(`Invalid amount: ${session.amount}`)
    return new Promise<CheckoutResult>((resolve) => {
      MonnifySDK.initialize({
        amount,
        currency: session.currency,
        reference: session.reference,
        customerFullName: session.customer_name,
        customerEmail: session.email,
        apiKey: session.public_key,
        contractCode: session.contract_code,
        paymentDescription: 'Wallet funding',
        metadata: session.meta,
        onComplete: () => resolve({ status: 'success', reference: session.reference }),
        onClose: () => resolve({ status: 'closed', reference: session.reference }),
      })
    })
  },
}
