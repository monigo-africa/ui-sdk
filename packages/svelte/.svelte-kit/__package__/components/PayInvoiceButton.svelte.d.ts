interface Props {
    invoiceId: string;
    label?: string;
    class?: string;
    onBefore?: () => boolean | Promise<boolean>;
    onSuccess?: (result: {
        authorization_url: string;
    }) => void;
    onError?: (err: unknown) => void;
}
declare const PayInvoiceButton: import("svelte").Component<Props, {}, "">;
type PayInvoiceButton = ReturnType<typeof PayInvoiceButton>;
export default PayInvoiceButton;
//# sourceMappingURL=PayInvoiceButton.svelte.d.ts.map