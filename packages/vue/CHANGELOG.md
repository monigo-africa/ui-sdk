# @monigo/vue

## 0.3.1

### Patch Changes

- @monigo/portal-core@0.3.1
- @monigo/tokens@0.3.1

## 0.3.0

### Minor Changes

- e054661: Add @monigo/vue — Vue 3.4+ customer-portal components mirroring @monigo/svelte.

### Patch Changes

- Wire `CancelSubscriptionButton` and `AddPaymentMethodButton` to the new `portal-core` client methods (`cancelSubscription`, `setupPaymentMethod`) — React and Vue now match Svelte's behavior: confirm + call backend + handle 501 for unsupported providers.
- Updated dependencies [8ee700f]
  - @monigo/portal-core@0.3.0
  - @monigo/tokens@0.3.0
