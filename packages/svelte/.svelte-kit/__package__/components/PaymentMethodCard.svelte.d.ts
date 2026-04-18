import type { CustomerPaymentMethod } from '@monigo/portal-core';
interface Props {
    method: CustomerPaymentMethod;
    class?: string;
    onRemove?: (id: string) => void;
    onSetDefault?: (id: string) => void;
}
declare const PaymentMethodCard: import("svelte").Component<Props, {}, "">;
type PaymentMethodCard = ReturnType<typeof PaymentMethodCard>;
export default PaymentMethodCard;
//# sourceMappingURL=PaymentMethodCard.svelte.d.ts.map