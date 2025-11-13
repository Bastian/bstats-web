<script lang="ts">
    import { NavigationMenu as BitsNavigationMenu } from 'bits-ui';
    import type { Snippet } from 'svelte';

    type Props = BitsNavigationMenu.TriggerProps & {
        children: Snippet;
        class?: string;
    };

    let { children, class: className, ...restProps }: Props = $props();
</script>

<BitsNavigationMenu.Trigger
    class={[
        'group relative inline-flex cursor-pointer items-center gap-1 rounded-full bg-slate-100/80 px-3 py-1.5 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900',
        'before:absolute before:inset-0 before:-inset-x-3 before:-inset-y-4 before:rounded-full',
        'focus-visible:ring-2 focus-visible:ring-brand-500/70 focus-visible:ring-offset-2 focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
    ]}
    {...restProps}
>
    {@render children()}
</BitsNavigationMenu.Trigger>
