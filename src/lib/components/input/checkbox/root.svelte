<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    interface Props extends HTMLAttributes<HTMLDivElement> {
        children: Snippet;
    }

    let { children, class: className, ...restProps }: Props = $props();
</script>

<div class={['flex items-center gap-2', className]} {...restProps}>
    {@render children()}
</div>

<style lang="postcss">
    @reference "$lib/../app.css";

    div :global(label) {
        @apply text-sm leading-none font-medium text-slate-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-300;
    }
</style>
