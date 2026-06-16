import { loadScript } from './loadScript'
import type { CheckoutAdapter, CheckoutResult } from './types'

const SCRIPT = 'https://js.paystack.co/v2/inline.js'

export const paystackAdapter: CheckoutAdapter = {
  async launch(session): Promise<CheckoutResult> {
    await loadScript(SCRIPT)
    const PaystackPop = (globalThis as Record<string, unknown>).PaystackPop as
      | (new () => { resumeTransaction: (code: string, cbs: Record<string, () => void>) => void })
      | undefined
    if (!PaystackPop) throw new Error('Paystack inline script did not load')
    if (!session.access_code) throw new Error('Paystack session missing access_code')
    const popup = new PaystackPop()
    return new Promise<CheckoutResult>((resolve) => {
      popup.resumeTransaction(session.access_code as string, {
        onSuccess: () => resolve({ status: 'success', reference: session.reference }),
        onCancel: () => resolve({ status: 'closed', reference: session.reference }),
        onError: () => resolve({ status: 'failed', reference: session.reference }),
      })
    })
  },
}
