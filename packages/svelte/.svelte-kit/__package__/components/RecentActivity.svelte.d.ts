import { type PortalInvoice, type Bill } from '@monigo/portal-core';
interface Props {
    onInvoiceClick?: (i: PortalInvoice) => void;
    onBillClick?: (b: Bill) => void;
    class?: string;
}
declare const RecentActivity: import("svelte").Component<Props, {}, "">;
type RecentActivity = ReturnType<typeof RecentActivity>;
export default RecentActivity;
//# sourceMappingURL=RecentActivity.svelte.d.ts.map