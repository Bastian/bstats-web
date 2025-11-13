<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    interface Props extends HTMLAttributes<HTMLDivElement> {
        children: Snippet;
    }

    let { children, class: className, ...restProps }: Props = $props();
</script>

<div class={['flex flex-col gap-1', className]} {...restProps}>
    {@render children()}
</div>

<style lang="postcss">
    @reference "$lib/../app.css";

    div :global(label) {
        @apply text-sm font-semibold tracking-wide text-slate-700;
    }
</style>
