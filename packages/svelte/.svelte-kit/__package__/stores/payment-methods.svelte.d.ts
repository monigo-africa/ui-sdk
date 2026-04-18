import { type PaymentMethodsState, type PaymentMethodsAction, type PortalClient } from '@monigo/portal-core';
import { RuneStore } from './base-rune.svelte';
export type PaymentMethodsRune = RuneStore<PaymentMethodsState, PaymentMethodsAction>;
export declare function createPaymentMethodsRune(client: PortalClient): PaymentMethodsRune;
//# sourceMappingURL=payment-methods.svelte.d.ts.map