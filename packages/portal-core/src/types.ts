import type { Invoice, Subscription, PayoutAccount } from '@monigo/sdk'

// ── Portal identity ────────────────────────────────────────────────────────

export interface PortalCustomerInfo {
  customer_id: string
  customer_name: string
  customer_email: string
  org_id: string
  org_name: string
  token_label: string
  expires_at: string | null
}

export interface PortalToken {
  id: string
  token: string
  label: string
  customer_id: string
  expires_at: string | null
  last_used_at: string | null
  created_at: string
  portal_url: string
}

// ── Invoices (reuse SDK Invoice) ──────────────────────────────────────────

export type PortalInvoice = Invoice
export interface PortalInvoicesListResponse {
  invoices: PortalInvoice[]
  count: number
}

export interface PaymentTransaction {
  id: string
  invoice_id: string
  amount: string
  currency: string
  status: 'pending' | 'succeeded' | 'failed'
  provider: string
  reference: string
  created_at: string
}

// ── Bills ──────────────────────────────────────────────────────────────────

export interface Bill {
  id: string
  number: string
  customer_id: string
  customer_name: string
  total: string
  currency: string
  status: 'draft' | 'finalized' | 'paid' | 'payout_failed' | 'voided'
  issued_at: string
  due_date: string | null
  period_start: string | null
  period_end: string | null
  line_items: unknown[]
}

export interface PortalBillsListResponse {
  bills: Bill[]
  count: number
}

export interface PayoutTransaction {
  id: string
  bill_id: string
  amount: string
  currency: string
  status: 'pending' | 'succeeded' | 'failed'
  provider: string
  reference: string
  created_at: string
}

// ── Subscriptions ─────────────────────────────────────────────────────────

export interface PortalSubscription extends Subscription {
  plan_name?: string
  plan_type?: 'collection' | 'payout'
}

// ── Wallets ───────────────────────────────────────────────────────────────

export interface PortalWallet {
  id: string
  currency: string
  balance: string
  status: 'active' | 'suspended' | 'closed'
  virtual_accounts: PortalVirtualAccount[]
  created_at: string
}

export interface PortalVirtualAccount {
  id: string
  provider: string
  account_number: string
  bank_name: string | null
  account_name: string
  status: string
}

export interface PortalLedgerEntry {
  id: string
  wallet_id: string
  entry_type: string
  direction: 'credit' | 'debit'
  amount: string
  currency: string
  balance_after: string
  description: string | null
  created_at: string
}

export interface PortalWalletTransactionsResponse {
  entries: PortalLedgerEntry[]
  count: number
}

// ── Payment methods ───────────────────────────────────────────────────────

export interface CustomerPaymentMethod {
  id: string
  customer_id: string
  type: 'card' | 'bank_account' | 'mobile_money'
  last4: string | null
  brand: string | null
  exp_month: number | null
  exp_year: number | null
  is_default: boolean
  created_at: string
}

// ── Payout accounts ───────────────────────────────────────────────────────

export type CustomerPayoutAccount = PayoutAccount & {
  customer_id: string
}

// ── Wallet funding session ─────────────────────────────────────────────────

export type FundingProvider = 'paystack' | 'stripe' | 'flutterwave' | 'monnify'

/** Provider-agnostic inline-checkout session returned by initWalletFunding.
 *  Mirrors the backend domain.WalletFundingSession. Only PUBLIC credentials. */
export interface FundingSession {
  provider: FundingProvider
  reference: string
  amount: string
  currency: string
  email?: string         // backend omitempty
  customer_name?: string // backend omitempty
  public_key: string
  access_code?: string   // paystack
  client_secret?: string // stripe
  contract_code?: string // monnify
  meta: Record<string, unknown>
  authorization_url?: string // redirect fallback
}

// ── Re-exports for consumer convenience ───────────────────────────────────

export type { Invoice, Subscription, PayoutAccount } from '@monigo/sdk'
