<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import Cell from './cell.svelte';
    import Row from './row.svelte';

    interface Props extends HTMLAttributes<HTMLTableRowElement> {
        href: string;
        label: string;
        children: Snippet;
    }

    let { href, label, children, class: className, ...restProps }: Props = $props();
</script>

<Row
    class={[
        'group relative focus-within:bg-slate-50 focus-within:ring-2 focus-within:ring-brand-500/70 focus-within:ring-inset',
        className
    ]}
    {...restProps}
>
    <Cell class="font-semibold text-slate-900">
        <a
            {href}
            class="group-focus-within:text-brand-600 after:absolute after:inset-0 after:content-[''] hover:text-brand-600 focus-visible:outline-none"
        >
            {label}
        </a>
    </Cell>
    {@render children()}
</Row>
