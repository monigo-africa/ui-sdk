import { type MessageCatalog } from '@monigo/portal-core';
import { type MonigoTheme } from './context';
import type { Snippet } from 'svelte';
interface Props {
    portalToken: string;
    baseUrl?: string;
    fetch?: typeof globalThis.fetch;
    theme?: Partial<MonigoTheme>;
    locale?: string;
    messages?: Partial<MessageCatalog>;
    onUnauthorized?: () => void;
    onError?: (err: unknown) => void;
    children: Snippet;
}
declare const MonigoProvider: import("svelte").Component<Props, {}, "">;
type MonigoProvider = ReturnType<typeof MonigoProvider>;
export default MonigoProvider;
//# sourceMappingURL=MonigoProvider.svelte.d.ts.map