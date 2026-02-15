<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    interface Props extends HTMLAttributes<HTMLTableSectionElement> {
        children: Snippet;
    }

    let { children, class: className, ...restProps }: Props = $props();
</script>

<tbody
    class={[
        'divide-y divide-slate-200 text-slate-700 dark:divide-dark-700 dark:text-slate-300',
        className
    ]}
    {...restProps}
>
    {@render children()}
</tbody>
