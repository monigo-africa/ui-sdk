import type { FundingSession } from '../types'
import type { CheckoutAdapter, CheckoutResult, LaunchOptions } from './types'
import { paystackAdapter } from './paystack'
import { stripeAdapter } from './stripe'
import { flutterwaveAdapter } from './flutterwave'
import { monnifyAdapter } from './monnify'

export type { CheckoutResult, LaunchOptions, CheckoutAdapter } from './types'

const adapters: Record<FundingSession['provider'], CheckoutAdapter> = {
  paystack: paystackAdapter,
  stripe: stripeAdapter,
  flutterwave: flutterwaveAdapter,
  monnify: monnifyAdapter,
}

/** Open the provider's inline checkout for a funding session. */
export async function launchCheckout(session: FundingSession, opts: LaunchOptions = {}): Promise<CheckoutResult> {
  const adapter = adapters[session.provider]
  if (!adapter) throw new Error(`No checkout adapter for provider: ${session.provider}`)
  return adapter.launch(session, opts)
}
