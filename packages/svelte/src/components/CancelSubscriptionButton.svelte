<script lang="ts">
  import type { PortalSubscription } from '@monigo/portal-core'
  import { getMonigoContext } from '../provider/context'

  interface Props {
    subscription: PortalSubscription
    oncancel?: (sub: PortalSubscription) => void
    onError?: (err: unknown) => void
    label?: string
    class?: string
  }
  const { subscription, oncancel, onError, label, class: className = '' }: Props = $props()
  const { client, messages } = getMonigoContext()

  let loading = $state(false)
  let error = $state<string | null>(null)

  async function handleClick(): Promise<void> {
    if (typeof window === 'undefined') return
    const confirmed = window.confirm(messages['subscriptions.cancel.confirm'])
    if (!confirmed) return

    loading = true
    error = null
    try {
      await client.cancelSubscription(subscription.id)
      // Emit oncancel AFTER backend success so integrators can safely call
      // subscriptionsRune.dispatch({ type: 'refresh' }) in their handler.
      oncancel?.(subscription)
    } catch (err) {
      error = err instanceof Error ? err.message : String(err)
      onError?.(err)
    } finally {
      loading = false
    }
  }
</script>

<button
  type="button"
  class="cancel-btn {className}"
  onclick={handleClick}
  disabled={loading}
  aria-busy={loading}
>
  {loading ? messages['common.loading'] : (label ?? messages['subscriptions.action.cancel'])}
</button>

{#if error}
  <p class="cancel-error" role="alert">{error}</p>
{/if}

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
  .cancel-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .cancel-error {
    color: var(--monigo-color-danger);
    font-size: var(--monigo-text-sm);
    margin-top: var(--monigo-space-1);
  }
</style>
