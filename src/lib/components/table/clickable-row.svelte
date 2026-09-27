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
        'group relative has-[:focus-visible]:bg-slate-50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-500/70 has-[:focus-visible]:ring-inset dark:has-[:focus-visible]:bg-dark-700/50',
        className
    ]}
    {...restProps}
>
    <Cell>
        <a
            {href}
            class="font-semibold text-slate-900 group-has-[:focus-visible]:text-brand-600 after:absolute after:inset-0 after:content-[''] hover:text-brand-600 focus-visible:outline-none dark:text-slate-100 dark:group-has-[:focus-visible]:text-brand-400"
        >
            {label}
        </a>
    </Cell>
    {@render children()}
</Row>
