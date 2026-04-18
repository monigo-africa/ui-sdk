import { PaymentMethodsStore } from '@monigo/portal-core';
import { RuneStore } from './base-rune.svelte';
export function createPaymentMethodsRune(client) {
    return new RuneStore(new PaymentMethodsStore(client));
}
