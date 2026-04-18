<script lang="ts">
  import { getMonigoContext } from '../provider/context'

  interface Props {
    onadd: () => void
    label?: string
    class?: string
  }
  const { onadd, label, class: className = '' }: Props = $props()
  const { messages } = getMonigoContext()
</script>

<button type="button" class="btn {className}" onclick={onadd}>
  {label ?? messages['payment_methods.action.add']}
</button>

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
  .btn:hover { opacity: 0.9; }
</style>
