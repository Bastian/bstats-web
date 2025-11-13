<script lang="ts">
    import { NavigationMenu as BitsNavigationMenu } from 'bits-ui';
    import type { Snippet } from 'svelte';

    type Props = BitsNavigationMenu.LinkProps & {
        children: Snippet;
        class?: string;
        href: string;
    };

    let { children, class: className, href, ...restProps }: Props = $props();
</script>

<BitsNavigationMenu.Link
    {href}
    class={[
        'flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-600 transition',
        'hover:bg-brand-50 hover:text-slate-900',
        'focus-visible:bg-brand-50 focus-visible:text-slate-900 focus-visible:outline-none',
        className
    ]}
    {...restProps}
>
    {@render children()}
</BitsNavigationMenu.Link>
