<script lang="ts">
  import type { PortalSubscription } from '@monigo/portal-core'
  import { getMonigoContext } from '../provider/context'

  interface Props {
    subscription: PortalSubscription
    oncancel: (sub: PortalSubscription) => void
    label?: string
    class?: string
  }
  const { subscription, oncancel, label, class: className = '' }: Props = $props()
  const { messages } = getMonigoContext()

  function handleClick(): void {
    if (typeof window === 'undefined') return
    const confirmed = window.confirm(messages['subscriptions.cancel.confirm'])
    if (confirmed) oncancel(subscription)
  }
</script>

<button type="button" class="cancel-btn {className}" onclick={handleClick}>
  {label ?? messages['subscriptions.action.cancel']}
</button>

<style>
  .cancel-btn {
    padding: var(--monigo-space-2) var(--monigo-space-4);
    background: transparent;
    color: var(--monigo-color-danger);
    border: 1px solid var(--monigo-color-danger);
    border-radius: var(--monigo-radius-md);
    font-size: var(--monigo-text-sm);
    cursor: pointer;
  }
  .cancel-btn:hover { background: color-mix(in srgb, var(--monigo-color-danger) 10%, transparent); }
</style>
