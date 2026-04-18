<script lang="ts">
  interface Props { message: string; class?: string }
  const { message, class: className = '' }: Props = $props()
</script>

<p class="empty-state {className}">{message}</p>

<style>
  .empty-state {
    padding: var(--monigo-space-6);
    text-align: center;
    color: var(--monigo-color-muted-fg);
    font-size: var(--monigo-text-sm);
  }
</style>
