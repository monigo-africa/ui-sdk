<script lang="ts">
  interface Props {
    error: Error
    onRetry?: () => void
    retryLabel?: string
    class?: string
  }
  const { error, onRetry, retryLabel = 'Try again', class: className = '' }: Props = $props()
</script>

<div class="error-state {className}" role="alert">
  <p class="error-message">{error.message}</p>
  {#if onRetry}
    <button type="button" class="retry" onclick={onRetry}>{retryLabel}</button>
  {/if}
</div>

<style>
  .error-state {
    padding: var(--monigo-space-6);
    text-align: center;
  }
  .error-message {
    color: var(--monigo-color-danger);
    margin-bottom: var(--monigo-space-3);
  }
  .retry {
    padding: var(--monigo-space-2) var(--monigo-space-4);
    background: var(--monigo-color-primary);
    color: var(--monigo-color-primary-fg);
    border: none;
    border-radius: var(--monigo-radius-md);
    cursor: pointer;
  }
</style>
