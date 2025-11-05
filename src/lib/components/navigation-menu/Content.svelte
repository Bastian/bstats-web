<script lang="ts">
    import { NavigationMenu as BitsNavigationMenu } from 'bits-ui';
    import type { Snippet } from 'svelte';

    type Props = BitsNavigationMenu.ContentProps & {
        children: Snippet;
        class?: string;
        align?: 'start' | 'center' | 'end';
    };

    let { children, class: className, align = 'start', ...restProps }: Props = $props();
</script>

<BitsNavigationMenu.Content
    class={[
        'absolute top-full z-20 mt-1 w-max max-w-sm min-w-48 rounded-xl border border-slate-200 bg-white p-3 shadow-2xl',
        {
            'left-1/2 -translate-x-1/2': align === 'center',
            'left-0': align === 'start',
            'right-0': align === 'end'
        },
        'data-[state=closed]:animate-dropdown-out data-[state=open]:animate-dropdown-in',
        'outline-none focus-visible:outline-none',
        className
    ]}
    {...restProps}
>
    {@render children()}
</BitsNavigationMenu.Content>
