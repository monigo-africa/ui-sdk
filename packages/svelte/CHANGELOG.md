# @monigo/svelte

## 0.3.1

### Patch Changes

- Fix customer portal failing to mount with `no MonigoProvider ancestor found`.

  `MonigoProvider` was calling `setMonigoContext` inside `$effect`, but Svelte
  runs children's `<script>` blocks after the parent's script and before the
  parent's effects. Any child reading `getMonigoContext()` during init (e.g.
  `DashboardSummary`, `PortalDashboardPage`) therefore threw on first render.

  The provider now sets context synchronously during script init, with getter-
  backed fields so child reads stay reactive against the underlying `$derived`
  values. `MonigoContext`'s optional callbacks accept explicit `undefined` to
  satisfy `exactOptionalPropertyTypes` with the new getter-based shape.
  - @monigo/portal-core@0.3.1
  - @monigo/tokens@0.3.1

## 0.3.0

### Patch Changes

- 8ee700f: Add cancelSubscription() and setupPaymentMethod() to PortalClient; add generated api-types.ts from OpenAPI spec; wire cancelSubscription and setupPaymentMethod into CancelSubscriptionButton and AddPaymentMethodButton svelte action components.
- Updated dependencies [8ee700f]
  - @monigo/portal-core@0.3.0
  - @monigo/tokens@0.3.0

## 0.2.0

### Minor Changes

- First alpha release of @monigo/svelte with building-block components, page components, and the composed MonigoPortal. The hosted customer portal at platform/portal is refactored to consume this package.

### Patch Changes

- Updated dependencies
  - @monigo/tokens@0.2.0
  - @monigo/portal-core@0.2.0
