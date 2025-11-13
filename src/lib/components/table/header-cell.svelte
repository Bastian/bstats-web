<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    interface Props extends HTMLAttributes<HTMLTableCellElement> {
        children: Snippet;
        align?: 'left' | 'right' | 'center';
    }

    let { children, align = 'left', class: className, ...restProps }: Props = $props();
</script>

<th
    class={[
        'px-4 py-3 font-semibold tracking-[0.18em] uppercase',
        {
            'text-left': align === 'left',
            'text-right': align === 'right',
            'text-center': align === 'center'
        },
        className
    ]}
    {...restProps}
>
    {@render children()}
</th>
