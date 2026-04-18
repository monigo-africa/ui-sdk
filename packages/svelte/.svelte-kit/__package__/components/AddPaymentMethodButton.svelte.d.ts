interface Props {
    onadd?: () => void;
    onunsupported?: () => void;
    onError?: (err: unknown) => void;
    onBefore?: () => boolean | Promise<boolean>;
    label?: string;
    class?: string;
}
declare const AddPaymentMethodButton: import("svelte").Component<Props, {}, "">;
type AddPaymentMethodButton = ReturnType<typeof AddPaymentMethodButton>;
export default AddPaymentMethodButton;
//# sourceMappingURL=AddPaymentMethodButton.svelte.d.ts.map