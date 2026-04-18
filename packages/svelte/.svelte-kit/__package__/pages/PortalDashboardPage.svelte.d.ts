import type { PortalInvoice, Bill } from '@monigo/portal-core';
interface Props {
    onInvoiceClick?: (i: PortalInvoice) => void;
    onBillClick?: (b: Bill) => void;
    class?: string;
}
declare const PortalDashboardPage: import("svelte").Component<Props, {}, "">;
type PortalDashboardPage = ReturnType<typeof PortalDashboardPage>;
export default PortalDashboardPage;
//# sourceMappingURL=PortalDashboardPage.svelte.d.ts.map