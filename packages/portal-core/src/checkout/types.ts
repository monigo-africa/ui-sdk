import type { FundingSession } from '../types'

export interface CheckoutResult {
  status: 'success' | 'closed' | 'failed'
  reference: string
}

export interface LaunchOptions {
  /** Required by Stripe embedded checkout — the element to mount the iframe into. */
  mountEl?: HTMLElement
  /** When aborted (e.g. the widget's modal is closed) the checkout is torn down and
   *  resolves as 'closed'. Mainly needed for Stripe embedded, which has no native close event. */
  signal?: AbortSignal
}

export interface CheckoutAdapter {
  launch(session: FundingSession, opts: LaunchOptions): Promise<CheckoutResult>
}
