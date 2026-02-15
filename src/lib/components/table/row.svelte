<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    interface Props extends HTMLAttributes<HTMLTableRowElement> {
        children: Snippet;
    }

    let { children, class: className, ...restProps }: Props = $props();
</script>

<tr
    class={['transition-colors hover:bg-slate-50 dark:hover:bg-dark-700/50', className]}
    {...restProps}
>
    {@render children()}
</tr>
