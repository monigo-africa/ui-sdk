<script lang="ts">
  import { getMonigoContext } from '../provider/context'

  interface Props {
    paymentMethodId: string
    onsuccess?: () => void
    onError?: (err: unknown) => void
    class?: string
  }
  const { paymentMethodId, onsuccess, onError, class: className = '' }: Props = $props()
  const { client, messages } = getMonigoContext()

  let loading = $state(false)

  async function handleClick() {
    loading = true
    try {
      await client.setDefaultPaymentMethod(paymentMethodId)
      onsuccess?.()
    } catch (err) {
      onError?.(err)
    } finally {
      loading = false
    }
  }
</script>

<button type="button" class="btn {className}" onclick={handleClick} disabled={loading}>
  {loading ? messages['common.loading'] : messages['payment_methods.action.default']}
</button>

<style>
  .btn {
    padding: var(--monigo-space-2) var(--monigo-space-3);
    background: transparent;
    color: var(--monigo-color-primary);
    border: 1px solid var(--monigo-color-primary);
    border-radius: var(--monigo-radius-md);
    font-size: var(--monigo-text-sm);
    cursor: pointer;
  }
  .btn:hover:not(:disabled) { background: color-mix(in srgb, var(--monigo-color-primary) 10%, transparent); }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
