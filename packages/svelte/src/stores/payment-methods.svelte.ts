import { PaymentMethodsStore, type PaymentMethodsState, type PaymentMethodsAction, type PortalClient } from '@monigo/portal-core'
import { RuneStore } from './base-rune.svelte'

export type PaymentMethodsRune = RuneStore<PaymentMethodsState, PaymentMethodsAction>

export function createPaymentMethodsRune(client: PortalClient): PaymentMethodsRune {
  return new RuneStore(new PaymentMethodsStore(client))
}
