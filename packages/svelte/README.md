# @monigo/svelte

Svelte 5 customer-portal building blocks and composed portal for Monigo.

## Install

```bash
npm install @monigo/svelte @monigo/portal-core @monigo/tokens svelte
```

## Five-minute integration

```svelte
<script lang="ts">
  import { MonigoProvider, MonigoPortal } from '@monigo/svelte'
  import '@monigo/tokens/monigo.css'

  let { portalToken } = $props<{ portalToken: string }>()
</script>

<MonigoProvider {portalToken} theme={{ primary: '#6366f1', accent: '#f43f5e', mode: 'auto' }}>
  <MonigoPortal basePath="/billing" />
</MonigoProvider>
```

## Building-block composition

```svelte
<MonigoProvider {portalToken}>
  <DashboardSummary />
  <InvoiceList limit={10} onInvoiceClick={(i) => goto(`/invoices/${i.id}`)} />
  <SubscriptionList />
</MonigoProvider>
```

See the package's exported components for the full list of building blocks.
