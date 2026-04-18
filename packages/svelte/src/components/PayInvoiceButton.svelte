<script lang="ts">
  import { getMonigoContext } from '../provider/context'

  interface Props {
    invoiceId: string
    label?: string
    class?: string
    onBefore?: () => boolean | Promise<boolean>
    onSuccess?: (result: { authorization_url: string }) => void
    onError?: (err: unknown) => void
  }
  const { invoiceId, label, class: className = '', onBefore, onSuccess, onError }: Props = $props()
  const { client, messages } = getMonigoContext()

  let loading = $state(false)

  async function pay() {
    if (onBefore) {
      const ok = await onBefore()
      if (!ok) return
    }
    loading = true
    try {
      const result = await client.payInvoice(invoiceId)
      onSuccess?.(result)
      if (typeof window !== 'undefined') {
        window.location.href = result.authorization_url
      }
    } catch (err) {
      onError?.(err)
    } finally {
      loading = false
    }
  }
</script>

<button type="button" class="pay-btn {className}" onclick={pay} disabled={loading} aria-busy={loading}>
  {loading ? messages['common.loading'] : (label ?? messages['invoices.action.pay'])}
</button>

<style>
  .pay-btn {
    padding: var(--monigo-space-3) var(--monigo-space-5);
    background: var(--monigo-color-primary);
    color: var(--monigo-color-primary-fg);
    border: none;
    border-radius: var(--monigo-radius-md);
    font-size: var(--monigo-text-md);
    cursor: pointer;
  }
  .pay-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .pay-btn:hover:not(:disabled) { opacity: 0.9; }
</style>
