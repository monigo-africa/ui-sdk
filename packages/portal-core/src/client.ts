import { PortalApiError, PortalUnauthorizedError } from './errors'
import type {
  PortalCustomerInfo,
  PortalInvoice,
  PortalInvoicesListResponse,
  PaymentTransaction,
  Bill,
  PortalBillsListResponse,
  PayoutTransaction,
  CustomerPayoutAccount,
  CustomerPaymentMethod,
  PortalSubscription,
  PortalWallet,
  PortalWalletTransactionsResponse,
  FundingSession,
} from './types'

const DEFAULT_BASE_URL = 'https://api.monigo.co/api/v1'

export interface PortalClientOptions {
  portalToken: string
  baseUrl?: string
  fetch?: typeof fetch
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export class PortalClient {
  private readonly portalToken: string
  private readonly baseUrl: string
  private readonly fetchImpl: typeof fetch

  constructor(opts: PortalClientOptions) {
    this.portalToken = opts.portalToken
    this.baseUrl = (opts.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, '')
    this.fetchImpl = opts.fetch ?? globalThis.fetch
    if (!this.fetchImpl) {
      throw new Error('PortalClient: no fetch implementation found; pass one via options.fetch')
    }
  }

  // ── Identity ──────────────────────────────────────────────────────────
  getMe(): Promise<PortalCustomerInfo> {
    return this.request('GET', '/portal/me')
  }

  // ── Invoices ──────────────────────────────────────────────────────────
  getInvoices(page = 1, limit = 20): Promise<PortalInvoicesListResponse> {
    return this.request('GET', `/portal/invoices?page=${page}&limit=${limit}`)
  }
  getInvoice(id: string): Promise<{ invoice: PortalInvoice }> {
    return this.request('GET', `/portal/invoices/${id}`)
  }
  payInvoice(id: string): Promise<{ authorization_url: string; reference: string; transaction_id: string; provider: string }> {
    return this.request('POST', `/portal/invoices/${id}/pay`)
  }
  payInvoiceWithCard(invoiceId: string, paymentMethodId: string): Promise<{ message: string; charged: boolean; status: 'paid' | 'failed' }> {
    return this.request('POST', `/portal/invoices/${invoiceId}/pay-with-card`, { payment_method_id: paymentMethodId })
  }
  payInvoiceWithWallet(invoiceId: string, walletId: string): Promise<{ message: string }> {
    return this.request('POST', `/portal/invoices/${invoiceId}/pay-with-wallet`, { wallet_id: walletId })
  }
  getInvoiceTransactions(id: string): Promise<{ transactions: PaymentTransaction[] }> {
    return this.request('GET', `/portal/invoices/${id}/transactions`)
  }
  /**
   * Download invoice as PDF. Note: the backend returns 501 until PDF generation is
   * implemented. Callers should catch PortalApiError with status === 501 and fall
   * back to rendering the invoice detail page via getInvoice().
   */
  async downloadInvoicePDF(id: string): Promise<Blob> {
    const url = `${this.baseUrl}/portal/invoices/${id}/pdf`
    const res = await this.fetchImpl(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Portal-Token': this.portalToken,
      },
    })
    const parsed: unknown = await res.json().catch(() => null)
    if (!res.ok) {
      const message = extractMessage(parsed) ?? `Portal API GET /portal/invoices/${id}/pdf failed with ${res.status}`
      if (res.status === 401) {
        throw new PortalUnauthorizedError(message, { url, body: parsed })
      }
      throw new PortalApiError(message, { status: res.status, body: parsed, url })
    }
    return new Blob([JSON.stringify(parsed)], { type: 'application/pdf' })
  }

  // ── Bills ─────────────────────────────────────────────────────────────
  getBills(page = 1, limit = 20): Promise<PortalBillsListResponse> {
    return this.request('GET', `/portal/bills?page=${page}&limit=${limit}`)
  }
  getBill(id: string): Promise<{ bill: Bill }> {
    return this.request('GET', `/portal/bills/${id}`)
  }
  getBillTransactions(id: string): Promise<{ transactions: PayoutTransaction[] }> {
    return this.request('GET', `/portal/bills/${id}/transactions`)
  }

  // ── Subscriptions ─────────────────────────────────────────────────────
  getSubscriptions(): Promise<{ subscriptions: PortalSubscription[]; count: number }> {
    return this.request('GET', '/portal/subscriptions')
  }
  getSubscription(id: string): Promise<{ subscription: PortalSubscription }> {
    return this.request('GET', `/portal/subscriptions/${id}`)
  }
  cancelSubscription(id: string): Promise<{ message: string }> {
    return this.request('POST', `/portal/subscriptions/${id}/cancel`)
  }

  // ── Wallets ───────────────────────────────────────────────────────────
  getWallets(): Promise<{ wallets: PortalWallet[]; count: number }> {
    return this.request('GET', '/portal/wallets')
  }
  getWallet(id: string): Promise<{ wallet: PortalWallet }> {
    return this.request('GET', `/portal/wallets/${id}`)
  }
  getWalletTransactions(id: string, page = 1, limit = 20): Promise<PortalWalletTransactionsResponse> {
    return this.request('GET', `/portal/wallets/${id}/transactions?page=${page}&limit=${limit}`)
  }
  fundWallet(id: string, body: { amount: string; currency: string }): Promise<{ message: string; authorization_url: string; reference: string; provider: string }> {
    return this.request('POST', `/portal/wallets/${id}/fund`, body)
  }
  initWalletFunding(id: string, body: { amount: string; currency: string }): Promise<FundingSession> {
    return this.request('POST', `/portal/wallets/${id}/fund`, { ...body, inline: true })
  }

  // ── Payment methods ───────────────────────────────────────────────────
  getPaymentMethods(): Promise<{ payment_methods: CustomerPaymentMethod[] }> {
    return this.request('GET', '/portal/payment-methods')
  }
  setupPaymentMethod(): Promise<{ message: string; authorization_url: string; reference: string; provider: string }> {
    return this.request('POST', '/portal/payment-methods/setup')
  }
  deletePaymentMethod(id: string): Promise<{ message: string }> {
    return this.request('DELETE', `/portal/payment-methods/${id}`)
  }
  setDefaultPaymentMethod(id: string): Promise<{ message: string }> {
    return this.request('PUT', `/portal/payment-methods/${id}/default`)
  }

  // ── Payout accounts ───────────────────────────────────────────────────
  getPayoutAccounts(): Promise<{ payout_accounts: CustomerPayoutAccount[] }> {
    return this.request('GET', '/portal/payout-accounts')
  }
  createPayoutAccount(body: {
    account_name: string
    payout_method: 'bank_transfer' | 'mobile_money'
    currency: string
    bank_name?: string
    bank_code?: string
    account_number?: string
    mobile_money_number?: string
  }): Promise<{ payout_account: CustomerPayoutAccount }> {
    return this.request('POST', '/portal/payout-accounts', body)
  }

  // ── internal ──────────────────────────────────────────────────────────
  private async request<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`
    const init: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Portal-Token': this.portalToken,
      },
    }
    if (body !== undefined) {
      init.body = JSON.stringify(body)
    }

    const res = await this.fetchImpl(url, init)
    const parsed: unknown = await res.json().catch(() => null)

    if (!res.ok) {
      const message = extractMessage(parsed) ?? `Portal API ${method} ${path} failed with ${res.status}`
      if (res.status === 401) {
        throw new PortalUnauthorizedError(message, { url, body: parsed })
      }
      throw new PortalApiError(message, { status: res.status, body: parsed, url })
    }

    return parsed as T
  }
}

function extractMessage(body: unknown): string | null {
  if (body && typeof body === 'object' && 'error' in body && typeof (body as { error: unknown }).error === 'string') {
    return (body as { error: string }).error
  }
  return null
}
