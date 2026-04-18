import { describe, it, expect, vi } from 'vitest'
import { InvoicesStore } from './invoices'
import { PortalClient } from '../client'

function makeClient(overrides: Partial<Record<keyof PortalClient, unknown>>): PortalClient {
  return Object.assign(
    Object.create(PortalClient.prototype),
    overrides,
  ) as PortalClient
}

describe('InvoicesStore', () => {
  it('starts in idle state', () => {
    const client = makeClient({})
    const store = new InvoicesStore(client)
    expect(store.getState().status).toBe('idle')
  })

  it('transitions idle → loading → ready on load()', async () => {
    const client = makeClient({
      getInvoices: vi.fn(async () => ({
        invoices: [{ id: 'in_1', number: '001', total: '100', currency: 'NGN', status: 'finalized' }],
        count: 1,
      })),
    })
    const store = new InvoicesStore(client)
    const seen: string[] = []
    store.subscribe((s) => seen.push(s.status))
    await store.dispatch({ type: 'load' })
    expect(seen).toEqual(['loading', 'ready'])
    expect(store.getState().status).toBe('ready')
    if (store.getState().status === 'ready') {
      expect(store.getState().invoices).toHaveLength(1)
    }
  })

  it('transitions to error on fetch failure', async () => {
    const client = makeClient({
      getInvoices: vi.fn(async () => { throw new Error('boom') }),
    })
    const store = new InvoicesStore(client)
    await store.dispatch({ type: 'load' })
    const state = store.getState()
    expect(state.status).toBe('error')
    if (state.status === 'error') {
      expect(state.error.message).toBe('boom')
    }
  })

  it('refresh reuses last parameters', async () => {
    const getInvoices = vi.fn(async () => ({ invoices: [], count: 0 }))
    const client = makeClient({ getInvoices })
    const store = new InvoicesStore(client)
    await store.dispatch({ type: 'load', page: 2, limit: 5 })
    await store.dispatch({ type: 'refresh' })
    expect(getInvoices).toHaveBeenNthCalledWith(1, 2, 5)
    expect(getInvoices).toHaveBeenNthCalledWith(2, 2, 5)
  })
})
