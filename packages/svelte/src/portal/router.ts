export interface RouteDef {
  path: string
  name: string
}

export interface CompiledRoute extends RouteDef {
  pattern: RegExp
  paramNames: string[]
}

export interface RouteMatch {
  name: string
  params: Record<string, string>
}

export function defineRoutes(routes: RouteDef[]): CompiledRoute[] {
  return routes.map((r) => {
    const paramNames: string[] = []
    const pattern = new RegExp(
      '^' +
        r.path.replace(/:([a-zA-Z0-9_]+)/g, (_, name) => {
          paramNames.push(name)
          return '([^/]+)'
        }) +
        '/?$',
    )
    return { ...r, pattern, paramNames }
  })
}

export function matchRoute(routes: CompiledRoute[], path: string): RouteMatch | null {
  const normalised = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
  for (const r of routes) {
    const m = r.pattern.exec(normalised)
    if (m) {
      const params: Record<string, string> = {}
      r.paramNames.forEach((name, i) => {
        params[name] = m[i + 1]!
      })
      return { name: r.name, params }
    }
  }
  return null
}
