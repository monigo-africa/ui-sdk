<script lang="ts">
  import { formatBillStatus } from '@monigo/portal-core'

  interface Props {
    status: string
    class?: string
  }
  const { status, class: className = '' }: Props = $props()

  const variant = $derived(
    status === 'paid' ? 'success' :
    status === 'payout_failed' ? 'danger' :
    status === 'finalized' ? 'warning' :
    'muted'
  )
</script>

<span class="badge badge-{variant} {className}">{formatBillStatus(status)}</span>

<style>
  .badge {
    display: inline-block;
    padding: 2px var(--monigo-space-2);
    border-radius: var(--monigo-radius-sm);
    font-size: var(--monigo-text-xs);
    font-weight: 500;
    line-height: 1.4;
  }
  .badge-success { background: color-mix(in srgb, var(--monigo-color-success) 15%, transparent); color: var(--monigo-color-success); }
  .badge-danger { background: color-mix(in srgb, var(--monigo-color-danger) 15%, transparent); color: var(--monigo-color-danger); }
  .badge-warning { background: color-mix(in srgb, var(--monigo-color-warning) 15%, transparent); color: var(--monigo-color-warning); }
  .badge-muted { background: var(--monigo-color-muted); color: var(--monigo-color-muted-fg); }
</style>
