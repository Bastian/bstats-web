<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    interface Props extends HTMLAttributes<HTMLTableCellElement> {
        children: Snippet;
        align?: 'left' | 'right' | 'center';
        colspan?: number;
    }

    let { children, align = 'left', colspan, class: className, ...restProps }: Props = $props();
</script>

<td
    class={[
        'px-4 py-3',
        {
            'text-left': align === 'left',
            'text-right': align === 'right',
            'text-center': align === 'center'
        },
        className
    ]}
    {colspan}
    {...restProps}
>
    {@render children()}
</td>
