<script lang="ts">
    import { NavigationMenu as BitsNavigationMenu } from 'bits-ui';
    import type { Snippet } from 'svelte';

    type Props = BitsNavigationMenu.ItemProps & {
        children: Snippet;
        openOnHover?: boolean;
    };

    let { children, value, openOnHover = true, ...restProps }: Props = $props();
</script>

<BitsNavigationMenu.Item class="relative" {value} {openOnHover} {...restProps}>
    {@render children()}
</BitsNavigationMenu.Item>
