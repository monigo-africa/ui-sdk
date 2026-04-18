export interface PortalApiErrorInit {
  status: number
  body: unknown
  url: string
}

export class PortalApiError extends Error {
  public readonly status: number
  public readonly body: unknown
  public readonly url: string

  constructor(message: string, init: PortalApiErrorInit) {
    super(message)
    this.name = 'PortalApiError'
    this.status = init.status
    this.body = init.body
    this.url = init.url
  }
}

export class PortalUnauthorizedError extends PortalApiError {
  constructor(message: string, init: { url: string; body?: unknown }) {
    super(message, { status: 401, body: init.body ?? null, url: init.url })
    this.name = 'PortalUnauthorizedError'
  }
}

export function isPortalApiError(err: unknown): err is PortalApiError {
  return err instanceof PortalApiError
}
