export function defineRoutes(routes) {
    return routes.map((r) => {
        const paramNames = [];
        const pattern = new RegExp('^' +
            r.path.replace(/:([a-zA-Z0-9_]+)/g, (_, name) => {
                paramNames.push(name);
                return '([^/]+)';
            }) +
            '/?$');
        return { ...r, pattern, paramNames };
    });
}
export function matchRoute(routes, path) {
    const normalised = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
    for (const r of routes) {
        const m = r.pattern.exec(normalised);
        if (m) {
            const params = {};
            r.paramNames.forEach((name, i) => {
                params[name] = m[i + 1];
            });
            return { name: r.name, params };
        }
    }
    return null;
}
