<script lang="ts">
    import { Button } from 'bits-ui';
    import type { Snippet } from 'svelte';

    type Props = Button.RootProps & {
        children: Snippet;
        variant?: 'primary';
        size?: 'small' | 'medium' | 'large';
        fullWidth?: boolean;
    };

    let {
        children,
        size,
        fullWidth,
        variant,
        ref = $bindable(null),
        ...restProps
    }: Props = $props();
</script>

<Button.Root
    bind:ref
    {...restProps}
    class={[
        'cursor-pointer justify-center disabled:cursor-not-allowed disabled:opacity-50',
        {
            'inline-flex items-center gap-2 rounded-full bg-brand-600 font-semibold text-white shadow-md transition-transform duration-200 hover:not-disabled:bg-brand-700 hover:not-disabled:shadow-lg focus-visible:ring-2 focus-visible:ring-brand-500/70 focus-visible:ring-offset-2 focus-visible:outline-none dark:focus-visible:ring-offset-dark-950':
                variant === 'primary' || !variant,
            'px-6 py-3 text-base': size === 'large',
            'px-5 py-2 text-sm': size === 'medium' || !size,
            'px-4 py-2 text-sm': size === 'small',
            'w-full': !!fullWidth
        },
        restProps.class
    ]}
>
    {@render children()}
</Button.Root>
