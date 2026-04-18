import { describe, it, expect } from 'vitest'
import { PortalApiError, isPortalApiError, PortalUnauthorizedError } from './errors'

describe('PortalApiError', () => {
  it('captures status, body, and url', () => {
    const err = new PortalApiError('bad request', { status: 400, body: { error: 'x' }, url: '/a' })
    expect(err.status).toBe(400)
    expect(err.body).toEqual({ error: 'x' })
    expect(err.url).toBe('/a')
    expect(err.message).toBe('bad request')
  })

  it('isPortalApiError narrows the type', () => {
    const err: unknown = new PortalApiError('x', { status: 500, body: null, url: '/b' })
    expect(isPortalApiError(err)).toBe(true)
    expect(isPortalApiError(new Error('plain'))).toBe(false)
  })

  it('PortalUnauthorizedError is a subclass with status 401', () => {
    const err = new PortalUnauthorizedError('unauthorized', { url: '/me' })
    expect(err).toBeInstanceOf(PortalApiError)
    expect(err.status).toBe(401)
  })
})
