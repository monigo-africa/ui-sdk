import type { PortalSubscription } from '@monigo/portal-core';
interface Props {
    subscription: PortalSubscription;
    oncancel: (sub: PortalSubscription) => void;
    label?: string;
    class?: string;
}
declare const CancelSubscriptionButton: import("svelte").Component<Props, {}, "">;
type CancelSubscriptionButton = ReturnType<typeof CancelSubscriptionButton>;
export default CancelSubscriptionButton;
//# sourceMappingURL=CancelSubscriptionButton.svelte.d.ts.map