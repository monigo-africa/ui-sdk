export interface RouteDef {
    path: string;
    name: string;
}
export interface CompiledRoute extends RouteDef {
    pattern: RegExp;
    paramNames: string[];
}
export interface RouteMatch {
    name: string;
    params: Record<string, string>;
}
export declare function defineRoutes(routes: RouteDef[]): CompiledRoute[];
export declare function matchRoute(routes: CompiledRoute[], path: string): RouteMatch | null;
//# sourceMappingURL=router.d.ts.map