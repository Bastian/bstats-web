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

<Row class={['relative', className]} {...restProps}>
    <Cell>
        <a
            {href}
            class="font-semibold text-slate-900 after:absolute after:inset-0 after:content-[''] hover:text-brand-600 focus-visible:text-brand-600 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-brand-500/70 focus-visible:after:ring-inset dark:text-slate-100 dark:focus-visible:text-brand-400"
        >
            {label}
        </a>
    </Cell>
    {@render children()}
</Row>
