<script lang="ts">
    import { deserialize } from '$app/forms';
    import IconAlertTriangle from '@tabler/icons-svelte/icons/alert-triangle';
    import IconCheck from '@tabler/icons-svelte/icons/check';
    import { dragHandleZone, type DndEvent } from 'svelte-dnd-action';
    import { flip } from 'svelte/animate';
    import type { PageData } from './$types';
    import ChartRow, { type ChartRowItem } from './chart-row.svelte';
    import ChartSearch from './chart-search.svelte';

    let { data }: { data: PageData } = $props();

    const flipDurationMs = 200;

    // Overridable derived: local edits update it optimistically, and it resets
    // whenever the page data is reloaded (e.g. after adding a chart).
    let items = $derived<ChartRowItem[]>(
        Object.entries(data.charts ?? {})
            .sort(([, a], [, b]) => (a.position ?? 0) - (b.position ?? 0))
            .map(([chartId, chart]) => ({
                id: chartId,
                title: chart.title ?? chartId,
                type: chart.type ?? '',
                isDefault: !!chart.isDefault,
                hidden: !!chart.hidden
            }))
    );

    const hiddenCount = $derived(items.filter((item) => item.hidden).length);

    let status = $state<{ kind: 'success' | 'error'; text: string } | null>(null);
    let statusTimeout: ReturnType<typeof setTimeout> | undefined;

    /** Success messages clear themselves; errors stay until the next action. */
    function showStatus(kind: 'success' | 'error', text: string, durationMs = 3000) {
        clearTimeout(statusTimeout);
        status = { kind, text };
        if (kind === 'success') {
            statusTimeout = setTimeout(() => (status = null), durationMs);
        }
    }

    /** Calls a form action of this page and returns an error message, or null on success. */
    async function runAction(name: string, fields: Record<string, string>): Promise<string | null> {
        try {
            const response = await fetch(`?/${name}`, {
                method: 'POST',
                headers: { 'x-sveltekit-action': 'true' },
                body: new URLSearchParams(fields)
            });
            const result = deserialize(await response.text());
            if (result.type === 'success') return null;
            if (result.type === 'failure' && typeof result.data?.error === 'string') {
                return result.data.error;
            }
            return 'Something went wrong. Reload the page and try again.';
        } catch {
            return 'Could not reach bStats. Check your connection and try again.';
        }
    }

    function updateItem(chartId: string, changes: Partial<ChartRowItem>) {
        items = items.map((item) => (item.id === chartId ? { ...item, ...changes } : item));
    }

    async function rename(chart: ChartRowItem, title: string) {
        const error = await runAction('renameChart', { chartId: chart.id, title });
        if (error) return error;
        updateItem(chart.id, { title });
        showStatus('success', `Renamed to “${title}”`);
        return null;
    }

    async function changeId(chart: ChartRowItem, newId: string) {
        const error = await runAction('changeChartId', { chartId: chart.id, newId });
        if (error) return error;
        updateItem(chart.id, { id: newId });
        // The data processor caches chart ids for up to an hour, so the old one
        // keeps working briefly; after that only the new id is accepted.
        showStatus(
            'success',
            `ID changed to “${newId}”. Update your plugin to send it; the old ID stops working within an hour.`,
            8000
        );
        return null;
    }

    async function toggleHidden(chart: ChartRowItem) {
        const hidden = !chart.hidden;
        updateItem(chart.id, { hidden });
        const error = await runAction('setChartVisibility', {
            chartId: chart.id,
            hidden: String(hidden)
        });
        if (error) {
            updateItem(chart.id, { hidden: !hidden });
            showStatus('error', error);
        } else {
            showStatus(
                'success',
                hidden ? `“${chart.title}” is hidden` : `“${chart.title}” is visible`
            );
        }
    }

    async function remove(chart: ChartRowItem) {
        const error = await runAction('deleteChart', { chartId: chart.id });
        if (error) {
            showStatus('error', error);
            return;
        }
        items = items.filter((item) => item.id !== chart.id);
        showStatus('success', `Deleted “${chart.title}”`);
    }

    let orderBeforeDrag: ChartRowItem[] = [];

    function handleConsider(e: CustomEvent<DndEvent<ChartRowItem>>) {
        if (e.detail.info.trigger === 'dragStarted') {
            orderBeforeDrag = items;
        }
        items = e.detail.items;
    }

    async function handleFinalize(e: CustomEvent<DndEvent<ChartRowItem>>) {
        const draggedId = e.detail.info.id;
        const oldIndex = orderBeforeDrag.findIndex((item) => item.id === draggedId);
        const newIndex = e.detail.items.findIndex((item) => item.id === draggedId);
        const previous = orderBeforeDrag;
        items = e.detail.items;

        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

        const error = await runAction('reorderCharts', {
            oldIndex: String(oldIndex),
            newIndex: String(newIndex)
        });
        if (error) {
            items = previous;
            showStatus('error', error);
        }
    }

    let highlightedId = $state<string | null>(null);
    let highlightTimeout: ReturnType<typeof setTimeout> | undefined;

    // Search doesn't filter the list; it scrolls to the chosen chart and
    // briefly highlights it, so the surrounding order stays visible.
    function jumpTo(chartId: string) {
        const row = document.getElementById(`chart-row-${chartId}`);
        if (!row) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        row.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });

        clearTimeout(highlightTimeout);
        highlightedId = chartId;
        highlightTimeout = setTimeout(() => (highlightedId = null), 2000);

        // Land keyboard focus on the chart's name, so Enter renames it. Deferred
        // until the search popup has finished closing and restoring its focus.
        setTimeout(() => {
            row.querySelector<HTMLElement>('[data-chart-title]')?.focus({ preventScroll: true });
        });
    }

    const pluginPath = $derived(
        `/plugin/${data.softwareUrl}/${data.plugin.name}/${data.plugin.id}` as const
    );
</script>

<div class="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
    <div>
        <h2 class="doc-card-title">Charts</h2>
        <p class="mt-1 max-w-prose text-sm text-slate-500 dark:text-slate-400">
            {items.length} charts{hiddenCount > 0 ? `, ${hiddenCount} hidden` : ''}. Your public
            page shows them in this order. Drag to reorder, click a name to rename it.
        </p>
    </div>
    <p
        aria-live="polite"
        class={[
            'flex min-h-5 items-center gap-1.5 text-sm font-medium',
            status?.kind === 'error'
                ? 'text-red-600 dark:text-red-400'
                : 'text-brand-700 dark:text-brand-400'
        ]}
    >
        {#if status}
            {#if status.kind === 'error'}
                <IconAlertTriangle size={16} aria-hidden="true" />
            {:else}
                <IconCheck size={16} aria-hidden="true" />
            {/if}
            {status.text}
        {/if}
    </p>
</div>

<div class="mt-4">
    <ChartSearch charts={items} onSelect={jumpTo} />
</div>

<ul
    class="mt-5 space-y-2"
    aria-label="Charts"
    use:dragHandleZone={{
        items,
        flipDurationMs,
        dropTargetStyle: {},
        // Otherwise the zone is marked aria-disabled whenever no drag is in
        // progress, which makes screen readers announce every row control as
        // disabled. The drag handles are the keyboard entry point instead.
        autoAriaDisabled: true,
        zoneTabIndex: -1
    }}
    onconsider={handleConsider}
    onfinalize={handleFinalize}
>
    {#each items as chart (chart.id)}
        <li id="chart-row-{chart.id}" animate:flip={{ duration: flipDurationMs }}>
            <ChartRow
                {chart}
                {pluginPath}
                highlighted={highlightedId === chart.id}
                onRename={(title) => rename(chart, title)}
                onChangeId={(id) => changeId(chart, id)}
                onToggleHidden={() => toggleHidden(chart)}
                onDelete={() => remove(chart)}
            />
        </li>
    {/each}
</ul>
