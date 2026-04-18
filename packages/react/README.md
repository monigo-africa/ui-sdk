# @monigo/react

React 18+ customer-portal components for [Monigo](https://monigo.co). Drop the composed portal into any React app with a single `<MonigoPortal>`, or use individual building-block components à la carte.

## Quick start

```tsx
import { MonigoProvider, MonigoPortal } from '@monigo/react'

export function App() {
  return (
    <MonigoProvider portalToken="pt_live_...">
      <MonigoPortal router="hash" />
    </MonigoProvider>
  )
}
```

## Peer dependencies

```
react >= 18.0.0
react-dom >= 18.0.0
```

## Theming

Pass a `theme` object to `<MonigoProvider>` to customise colours:

```tsx
<MonigoProvider
  portalToken="pt_live_..."
  theme={{ primary: '#7c3aed', accent: '#10b981', mode: 'light', radius: 'lg' }}
>
  ...
</MonigoProvider>
```

All theme values are injected as CSS custom properties (from `@monigo/tokens`) into a `<style>` tag in `document.head`.

## Individual components

```tsx
import { InvoiceList, PayInvoiceButton } from '@monigo/react'
```

Each component must be rendered inside a `<MonigoProvider>` ancestor.

## Hooks

```tsx
import { useInvoices } from '@monigo/react'

function MyInvoices({ client }) {
  const { state, dispatch } = useInvoices(client)
  // state: InvoicesState from @monigo/portal-core
}
```
