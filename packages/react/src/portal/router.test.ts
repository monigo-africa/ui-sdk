import { describe, it, expect } from 'vitest'
import { defineRoutes, matchRoute } from './router'

const routes = defineRoutes([
  { path: '/', name: 'dashboard' },
  { path: '/invoices', name: 'invoices' },
  { path: '/invoices/:id', name: 'invoice-detail' },
  { path: '/wallets/:id', name: 'wallet-detail' },
])

describe('matchRoute', () => {
  it('matches the root path', () => {
    expect(matchRoute(routes, '/')?.name).toBe('dashboard')
  })

  it('matches a static path', () => {
    expect(matchRoute(routes, '/invoices')?.name).toBe('invoices')
  })

  it('matches a path with a param and extracts it', () => {
    const m = matchRoute(routes, '/invoices/inv_abc123')
    expect(m?.name).toBe('invoice-detail')
    expect(m?.params.id).toBe('inv_abc123')
  })

  it('matches trailing-slash variant', () => {
    expect(matchRoute(routes, '/invoices/')?.name).toBe('invoices')
  })

  it('returns null for unmatched path', () => {
    expect(matchRoute(routes, '/unknown')).toBeNull()
  })

  it('extracts wallet id param', () => {
    expect(matchRoute(routes, '/wallets/w_99')?.params.id).toBe('w_99')
  })
})
