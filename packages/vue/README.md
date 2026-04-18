# @monigo/vue

Vue 3.4+ customer-portal components for [Monigo](https://monigo.co). Drop the composed portal into any Vue 3 app with a single `<MonigoPortal>`, or use individual building-block components à la carte.

## Quick start

```vue
<script setup lang="ts">
import { MonigoProvider, MonigoPortal } from '@monigo/vue'
</script>

<template>
  <MonigoProvider portal-token="pt_live_...">
    <MonigoPortal router="hash" />
  </MonigoProvider>
</template>
```

## Peer dependencies

```
vue >= 3.4.0
```

## Theming

Pass a `theme` object to `<MonigoProvider>` to customise colours:

```vue
<MonigoProvider
  portal-token="pt_live_..."
  :theme="{ primary: '#7c3aed', accent: '#10b981', mode: 'light', radius: 'lg' }"
>
  ...
</MonigoProvider>
```

All theme values are injected as CSS custom properties (from `@monigo/tokens`) into a `<style>` tag in `document.head`.

## Individual components

```vue
<script setup lang="ts">
import { InvoiceList, PayInvoiceButton } from '@monigo/vue'
</script>
```

Each component must be rendered inside a `<MonigoProvider>` ancestor.

## Composables

```vue
<script setup lang="ts">
import { useInvoices, useMonigoContext } from '@monigo/vue'

const { client } = useMonigoContext()
const { state, dispatch } = useInvoices(client)
// state: Readonly<Ref<InvoicesState>> from @monigo/portal-core
</script>
```
