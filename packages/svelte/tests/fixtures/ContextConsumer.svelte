<script lang="ts">
  import { getMonigoContext, type MonigoContext } from '../../src/provider/context'

  interface Props {
    onReady: (ctx: MonigoContext | null, err: unknown) => void
  }
  const { onReady }: Props = $props()

  let ctx: MonigoContext | null = null
  let err: unknown = undefined
  try {
    ctx = getMonigoContext()
  } catch (e) {
    err = e
  }
  // svelte-ignore state_referenced_locally
  onReady(ctx, err)
</script>

<span data-testid="consumer">consumer mounted</span>
