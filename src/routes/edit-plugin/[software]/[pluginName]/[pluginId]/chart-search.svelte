<script lang="ts">
    import IconSearch from '@tabler/icons-svelte/icons/search';
    import { Combobox } from 'bits-ui';
    import type { ChartRowItem } from './chart-row.svelte';

    interface Props {
        charts: ChartRowItem[];
        /** Called with the chart id the user picked. */
        onSelect: (chartId: string) => void;
    }

    let { charts, onSelect }: Props = $props();

    let query = $state('');
    let open = $state(false);
    let value = $state('');

    // Matches on name or id. Prefix matches are listed first, then the list order.
    const matches = $derived.by(() => {
        const q = query.trim().toLowerCase();
        if (!q) return charts;
        const rank = (chart: ChartRowItem) => {
            const title = chart.title.toLowerCase();
            const id = chart.id.toLowerCase();
            if (title.startsWith(q) || id.startsWith(q)) return 0;
            if (title.includes(q) || id.includes(q)) return 1;
            return -1;
        };
        return charts
            .map((chart, index) => ({ chart, index, rank: rank(chart) }))
            .filter((match) => match.rank !== -1)
            .sort((a, b) => a.rank - b.rank || a.index - b.index)
            .map((match) => match.chart);
    });

    function handleValueChange(chartId: string) {
        if (!chartId) return;
        onSelect(chartId);
        // Reset so the same chart can be picked again and the field is ready for
        // the next search. Deferred because the combobox writes the picked
        // label into the input right after this callback.
        setTimeout(() => {
            value = '';
            query = '';
        });
    }
</script>

<Combobox.Root
    type="single"
    bind:value
    bind:open
    inputValue={query}
    onValueChange={handleValueChange}
    items={charts.map((chart) => ({ value: chart.id, label: chart.title }))}
>
    <div class="relative">
        <IconSearch
            size={16}
            class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
        />
        <Combobox.Input
            oninput={(e) => {
                query = e.currentTarget.value;
                open = true;
            }}
            onfocus={() => (open = true)}
            placeholder="Find a chart by name or ID"
            aria-label="Find a chart by name or ID"
            class="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-3 pl-9 text-sm text-slate-900 transition-colors placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/30 focus:outline-none dark:border-dark-600 dark:bg-dark-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-dark-900"
        />
    </div>

    <Combobox.Portal>
        <Combobox.Content
            sideOffset={6}
            class="z-50 max-h-80 w-(--bits-floating-anchor-width) min-w-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-dark-600 dark:bg-dark-800"
        >
            {#each matches as chart (chart.id)}
                <Combobox.Item
                    value={chart.id}
                    label={chart.title}
                    class="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm data-highlighted:bg-brand-50 dark:data-highlighted:bg-dark-700"
                >
                    <span
                        class={[
                            'min-w-0 truncate font-medium',
                            chart.hidden
                                ? 'text-slate-500 dark:text-slate-400'
                                : 'text-slate-900 dark:text-slate-100'
                        ]}
                    >
                        {chart.title}
                        {#if chart.hidden}<span class="font-normal">(hidden)</span>{/if}
                    </span>
                    <code class="shrink-0 font-mono text-xs text-slate-500 dark:text-slate-400"
                        >{chart.id}</code
                    >
                </Combobox.Item>
            {:else}
                <p class="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
                    No chart matches “{query.trim()}”.
                </p>
            {/each}
        </Combobox.Content>
    </Combobox.Portal>
</Combobox.Root>
