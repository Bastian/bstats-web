<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import { getContext } from 'svelte';
    import type { TableSortState } from './sort.svelte.js';
    import IconChevronUp from '@tabler/icons-svelte/icons/chevron-up';
    import IconChevronDown from '@tabler/icons-svelte/icons/chevron-down';

    interface Props extends HTMLAttributes<HTMLTableCellElement> {
        children: Snippet;
        align?: 'left' | 'right' | 'center';
        sortKey?: string;
    }

    let { children, align = 'left', sortKey, class: className, ...restProps }: Props = $props();

    const sort = getContext<TableSortState | undefined>('table-sort');

    const sortable = $derived(sort && sortKey);
    const isActive = $derived(sort?.column === sortKey);
    const ariaSortValue = $derived(
        isActive ? (sort?.direction === 'asc' ? 'ascending' : 'descending') : undefined
    );
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
    aria-sort={ariaSortValue}
    {...restProps}
>
    {#if sortable}
        <button
            type="button"
            class={[
                'inline-flex w-full cursor-pointer select-none items-center gap-1',
                {
                    'justify-start': align === 'left',
                    'justify-end': align === 'right',
                    'justify-center': align === 'center'
                }
            ]}
            onclick={() => sort!.toggle(sortKey!)}
        >
            {#if align === 'right'}
                {#if isActive}
                    {#if sort!.direction === 'asc'}
                        <IconChevronUp size={14} />
                    {:else}
                        <IconChevronDown size={14} />
                    {/if}
                {:else}
                    <IconChevronDown size={14} class="opacity-0 group-hover:opacity-30" />
                {/if}
            {/if}
            {@render children()}
            {#if align !== 'right'}
                {#if isActive}
                    {#if sort!.direction === 'asc'}
                        <IconChevronUp size={14} />
                    {:else}
                        <IconChevronDown size={14} />
                    {/if}
                {:else}
                    <IconChevronDown size={14} class="opacity-0 group-hover:opacity-30" />
                {/if}
            {/if}
        </button>
    {:else}
        {@render children()}
    {/if}
</th>
