<script lang="ts">
  import MonigoProvider from '../../src/provider/MonigoProvider.svelte'
  import type { MonigoContext } from '../../src/provider/context'
  import ContextConsumer from './ContextConsumer.svelte'

  interface Props {
    portalToken: string
    onReady: (ctx: MonigoContext | null, err: unknown) => void
  }
  const { portalToken, onReady }: Props = $props()
</script>

<MonigoProvider {portalToken}>
  <ContextConsumer {onReady} />
</MonigoProvider>
