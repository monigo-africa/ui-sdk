# @monigo/react

## 0.3.0

### Minor Changes

- 5fd7e81: Add @monigo/react — React 18+ customer-portal components mirroring @monigo/svelte.

### Patch Changes

- Wire `CancelSubscriptionButton` and `AddPaymentMethodButton` to the new `portal-core` client methods (`cancelSubscription`, `setupPaymentMethod`) — React and Vue now match Svelte's behavior: confirm + call backend + handle 501 for unsupported providers.
- Updated dependencies [8ee700f]
  - @monigo/portal-core@0.3.0
  - @monigo/tokens@0.3.0
