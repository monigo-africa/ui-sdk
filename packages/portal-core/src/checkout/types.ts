import type { FundingSession } from '../types'

export interface CheckoutResult {
  status: 'success' | 'closed' | 'failed'
  reference: string
}

export interface LaunchOptions {
  /** Required by Stripe embedded checkout — the element to mount the iframe into. */
  mountEl?: HTMLElement
}

export interface CheckoutAdapter {
  launch(session: FundingSession, opts: LaunchOptions): Promise<CheckoutResult>
}
