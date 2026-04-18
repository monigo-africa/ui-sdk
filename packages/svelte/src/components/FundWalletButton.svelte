<script lang="ts">
  import { getMonigoContext } from '../provider/context'

  interface Props {
    walletId: string
    currency: string
    class?: string
    onError?: (err: unknown) => void
  }
  const { walletId, currency, class: className = '', onError }: Props = $props()
  const { client, messages } = getMonigoContext()

  let amount = $state('')
  let loading = $state(false)
  let open = $state(false)

  async function fund() {
    if (!amount || parseFloat(amount) <= 0) return
    loading = true
    try {
      const result = await client.fundWallet(walletId, { amount, currency })
      if (typeof window !== 'undefined') window.location.href = result.authorization_url
    } catch (err) {
      onError?.(err)
    } finally {
      loading = false
    }
  }
</script>

<div class="fund-wallet {className}">
  {#if !open}
    <button type="button" class="toggle" onclick={() => (open = true)}>{messages['wallets.action.fund']}</button>
  {:else}
    <form onsubmit={(e) => { e.preventDefault(); fund() }}>
      <label>
        <span class="sr-only">Amount</span>
        <input type="number" step="0.01" min="0" bind:value={amount} placeholder={`Amount (${currency})`} required disabled={loading} />
      </label>
      <button type="submit" disabled={loading || !amount}>{loading ? messages['common.loading'] : messages['wallets.action.fund']}</button>
      <button type="button" class="cancel" onclick={() => { open = false; amount = '' }} disabled={loading}>{messages['common.cancel']}</button>
    </form>
  {/if}
</div>

<style>
  .toggle, button[type='submit'] {
    padding: var(--monigo-space-2) var(--monigo-space-4);
    background: var(--monigo-color-primary);
    color: var(--monigo-color-primary-fg);
    border: none;
    border-radius: var(--monigo-radius-md);
    font-size: var(--monigo-text-sm);
    cursor: pointer;
  }
  button[type='submit']:disabled { opacity: 0.5; cursor: not-allowed; }
  form { display: flex; gap: var(--monigo-space-2); align-items: center; }
  input { padding: var(--monigo-space-2); border: 1px solid var(--monigo-color-border); border-radius: var(--monigo-radius-sm); font-size: var(--monigo-text-sm); }
  .cancel { background: transparent; color: var(--monigo-color-muted-fg); border: 1px solid var(--monigo-color-border); padding: var(--monigo-space-2) var(--monigo-space-3); border-radius: var(--monigo-radius-md); cursor: pointer; }
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
</style>
