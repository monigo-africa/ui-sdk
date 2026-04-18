<script lang="ts">
  import { getMonigoContext } from '../provider/context'

  interface Props {
    onadd?: () => void
    onunsupported?: () => void
    onError?: (err: unknown) => void
    onBefore?: () => boolean | Promise<boolean>
    label?: string
    class?: string
  }
  const { onadd, onunsupported, onError, onBefore, label, class: className = '' }: Props = $props()
  const { client, messages } = getMonigoContext()

  let loading = $state(false)
  let error = $state<string | null>(null)

  async function handleClick(): Promise<void> {
    if (onBefore) {
      const ok = await onBefore()
      if (!ok) return
    }
    loading = true
    error = null
    try {
      const result = await client.setupPaymentMethod()
      onadd?.()
      if (typeof window !== 'undefined') {
        window.location.href = result.authorization_url
      }
    } catch (err) {
      // 501 means provider doesn't support card setup (non-Paystack)
      if (err && typeof err === 'object' && 'status' in err && (err as { status: number }).status === 501) {
        onunsupported?.()
        error = messages['payment_methods.setup.unsupported']
      } else {
        error = err instanceof Error ? err.message : String(err)
        onError?.(err)
      }
    } finally {
      loading = false
    }
  }
</script>

<button
  type="button"
  class="btn {className}"
  onclick={handleClick}
  disabled={loading}
  aria-busy={loading}
>
  {loading ? messages['common.loading'] : (label ?? messages['payment_methods.action.add'])}
</button>

{#if error}
  <p class="add-error" role="alert">{error}</p>
{/if}

<style>
  .btn {
    padding: var(--monigo-space-2) var(--monigo-space-4);
    background: var(--monigo-color-primary);
    color: var(--monigo-color-primary-fg, #fff);
    border: 1px solid var(--monigo-color-primary);
    border-radius: var(--monigo-radius-md);
    font-size: var(--monigo-text-sm);
    cursor: pointer;
    font-weight: 500;
  }
  .btn:hover:not(:disabled) { opacity: 0.9; }
  .btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .add-error {
    color: var(--monigo-color-danger);
    font-size: var(--monigo-text-sm);
    margin-top: var(--monigo-space-1);
  }
</style>
