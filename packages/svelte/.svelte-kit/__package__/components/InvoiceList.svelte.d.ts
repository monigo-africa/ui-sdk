import { type PortalInvoice } from '@monigo/portal-core';
interface Props {
    limit?: number;
    page?: number;
    onInvoiceClick?: (invoice: PortalInvoice) => void;
    class?: string;
}
declare const InvoiceList: import("svelte").Component<Props, {}, "">;
type InvoiceList = ReturnType<typeof InvoiceList>;
export default InvoiceList;
//# sourceMappingURL=InvoiceList.svelte.d.ts.map