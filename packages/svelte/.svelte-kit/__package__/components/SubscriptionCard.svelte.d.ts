import { type PortalSubscription } from '@monigo/portal-core';
interface Props {
    subscription: PortalSubscription;
    class?: string;
    oncancel?: (sub: PortalSubscription) => void;
}
declare const SubscriptionCard: import("svelte").Component<Props, {}, "">;
type SubscriptionCard = ReturnType<typeof SubscriptionCard>;
export default SubscriptionCard;
//# sourceMappingURL=SubscriptionCard.svelte.d.ts.map