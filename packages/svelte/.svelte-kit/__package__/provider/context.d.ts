import type { PortalClient, MessageCatalog } from '@monigo/portal-core';
export declare const MONIGO_CONTEXT_KEY: unique symbol;
export interface MonigoTheme {
    primary: string;
    accent: string;
    mode: 'light' | 'dark' | 'auto';
    radius?: 'sm' | 'md' | 'lg';
    font?: string;
}
export interface MonigoContext {
    client: PortalClient;
    messages: MessageCatalog;
    locale: string;
    theme: MonigoTheme;
    onUnauthorized?: () => void;
    onError?: (err: unknown) => void;
}
export interface MonigoContextInit {
    client: PortalClient;
    messages: MessageCatalog;
    locale: string;
    theme: MonigoTheme;
    onUnauthorized?: () => void;
    onError?: (err: unknown) => void;
}
export declare function createMonigoContext(init: MonigoContextInit): MonigoContext;
export declare function setMonigoContext(ctx: MonigoContext): void;
export declare function getMonigoContext(): MonigoContext;
//# sourceMappingURL=context.d.ts.map