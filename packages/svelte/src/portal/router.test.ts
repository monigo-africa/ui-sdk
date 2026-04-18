import { describe, it, expect } from 'vitest'
import { matchRoute, defineRoutes } from './router'

const routes = defineRoutes([
  { path: '/', name: 'dashboard' },
  { path: '/invoices', name: 'invoices' },
  { path: '/invoices/:id', name: 'invoice-detail' },
  { path: '/wallets/:id', name: 'wallet-detail' },
])

describe('matchRoute', () => {
  it('matches exact paths', () => {
    expect(matchRoute(routes, '/')?.name).toBe('dashboard')
    expect(matchRoute(routes, '/invoices')?.name).toBe('invoices')
  })
  it('extracts path parameters', () => {
    const m = matchRoute(routes, '/invoices/inv_123')
    expect(m?.name).toBe('invoice-detail')
    expect(m?.params.id).toBe('inv_123')
  })
  it('returns null for unknown paths', () => {
    expect(matchRoute(routes, '/nope')).toBeNull()
  })
  it('strips trailing slashes', () => {
    expect(matchRoute(routes, '/invoices/')?.name).toBe('invoices')
  })
})
