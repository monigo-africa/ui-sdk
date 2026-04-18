<script lang="ts">
  interface Props { rows?: number; class?: string }
  const { rows = 3, class: className = '' }: Props = $props()
</script>

<div class="skeleton {className}" aria-busy="true" aria-live="polite">
  {#each Array.from({ length: rows }) as _}
    <div class="skeleton-row"></div>
  {/each}
</div>

<style>
  .skeleton-row {
    height: 1.25rem;
    margin: var(--monigo-space-2) 0;
    background: var(--monigo-color-muted);
    border-radius: var(--monigo-radius-sm);
    animation: pulse 1.5s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }
</style>
