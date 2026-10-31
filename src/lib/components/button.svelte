<script lang="ts">
    import { Button } from 'bits-ui';
    import type { Snippet } from 'svelte';

    type Props = Button.RootProps & {
        children: Snippet;
        variant?: 'primary' | 'danger';
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
        'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold text-white shadow-md transition-transform duration-200 hover:not-disabled:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-dark-950',
        {
            'bg-brand-600 hover:not-disabled:bg-brand-700 focus-visible:ring-brand-500/70':
                variant === 'primary' || !variant,
            'bg-red-600 hover:not-disabled:bg-red-700 focus-visible:ring-red-500/70':
                variant === 'danger',
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
