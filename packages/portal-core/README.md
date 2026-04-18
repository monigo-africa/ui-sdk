# @monigo/portal-core

Framework-agnostic core for Monigo customer-portal UI.

Provides a typed portal API client (`PortalClient`), per-feature state stores, Intl-based formatters, and a message catalog. Consume from `@monigo/react`, `@monigo/vue`, `@monigo/svelte`, or directly.

## Install

```bash
npm install @monigo/portal-core
```

## Quick start

```ts
import { PortalClient, InvoicesStore } from '@monigo/portal-core'

const client = new PortalClient({ portalToken: 'tok_...' })
const invoices = new InvoicesStore(client)

invoices.subscribe((state) => {
  if (state.status === 'ready') console.log(state.invoices)
})

await invoices.dispatch({ type: 'load' })
```

Framework packages wrap these stores into hooks, composables, or runes; see the framework-specific READMEs.
