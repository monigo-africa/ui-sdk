import { type Bill } from '@monigo/portal-core';
interface Props {
    limit?: number;
    page?: number;
    onBillClick?: (bill: Bill) => void;
    class?: string;
}
declare const BillList: import("svelte").Component<Props, {}, "">;
type BillList = ReturnType<typeof BillList>;
export default BillList;
//# sourceMappingURL=BillList.svelte.d.ts.map