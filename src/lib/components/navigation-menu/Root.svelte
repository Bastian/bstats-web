<script lang="ts">
    import { NavigationMenu as BitsNavigationMenu } from 'bits-ui';
    import type { Snippet } from 'svelte';

    type Props = BitsNavigationMenu.RootProps & {
        children: Snippet;
    };

    let { children, ...restProps }: Props = $props();
</script>

<BitsNavigationMenu.Root delayDuration={0} {...restProps}>
    {@render children()}
</BitsNavigationMenu.Root>
