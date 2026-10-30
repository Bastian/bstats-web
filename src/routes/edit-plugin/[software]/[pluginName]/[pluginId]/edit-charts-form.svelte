<script lang="ts">
    /*
     * TODO: This whole component is a mess and needs to be cleaned up.
     */
    import { resolve } from '$app/paths';
    import { invalidateAll } from '$app/navigation';

    import { dndzone } from 'svelte-dnd-action';
    import { flip } from 'svelte/animate';
    import type { PageData } from './$types';
    import Badge from '$lib/components/badge.svelte';
    import EditChartForm from './edit-chart-form.svelte';

    let { data }: { data: PageData } = $props();

    // Disabled due to recurring border-dispute complaints.
    const DISABLED_CHART_TYPES = new Set(['simple_map', 'advanced_map']);

    // Types that the add/edit form can handle. Older map charts stay visible
    // and reorderable, but have no edit form.
    const EDITABLE_CHART_TYPES = new Set([
        'simple_pie',
        'advanced_pie',
        'drilldown_pie',
        'single_linechart',
        'simple_bar',
        'advanced_bar'
    ]);

    let sortedCharts = $state(
        Object.keys(data.charts || {})
            .sort((a, b) => (data.charts![a]?.position ?? 0) - (data.charts![b]?.position ?? 0))
            .map((chartId) => ({
                id: chartId,
                chartId,
                uid: data.charts![chartId]?.uid ?? -1
            }))
    );

    $effect(() => {
        if (data.charts) {
            const charts = data.charts;
            sortedCharts = Object.keys(charts)
                .sort((a, b) => (charts[a]?.position ?? 0) - (charts[b]?.position ?? 0))
                .map((chartId) => ({
                    id: chartId,
                    chartId,
                    uid: charts[chartId]?.uid ?? -1
                }));
        }
    });

    let editingUid = $state<number | null>(null);
    // Incremented after a successful save so the editor is re-created with the
    // freshly loaded chart data instead of keeping the values it opened with.
    let editorVersion = $state(0);
    let savedNotice = $state(false);

    const editingChart = $derived(
        editingUid === null
            ? null
            : (Object.values(data.charts).find((chart) => chart.uid === editingUid) ?? null)
    );

    async function handleSaved() {
        await invalidateAll();
        editorVersion += 1;
        savedNotice = true;
    }

    const flipDurationMs = 200;
    let draggedItemOriginalIndex = $state(-1);

    function handleDndConsider(e: CustomEvent) {
        // Store the original index when drag starts
        if (e.detail.info.trigger === 'dragStarted') {
            for (let i = 0; i < sortedCharts.length; i++) {
                if (sortedCharts[i].id === e.detail.info.id) {
                    draggedItemOriginalIndex = i;
                    break;
                }
            }
        }

        sortedCharts = e.detail.items;
    }

    async function handleDndFinalize(e: CustomEvent) {
        const items = e.detail.items;

        // Find the new position
        let newIndex = -1;
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === e.detail.info.id) {
                newIndex = i;
                break;
            }
        }

        const oldIndex = draggedItemOriginalIndex;

        sortedCharts = items;

        if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
            try {
                const response = await fetch(`${window.location.pathname}?/reorderCharts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        oldIndex: oldIndex.toString(),
                        newIndex: newIndex.toString()
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to reorder charts');
                }
            } catch (error) {
                console.error('Failed to reorder charts:', error);
                // TODO Show error to user
            }
        }

        // Reset the original index
        draggedItemOriginalIndex = -1;
    }

    async function deleteChart(chartId: string) {
        if (!confirm(`Delete chart "${chartId}"?`)) {
            return;
        }

        try {
            const response = await fetch(`${window.location.pathname}?/deleteChart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    chartId: chartId
                })
            });

            if (response.ok) {
                // Remove from sortedCharts array reactively
                sortedCharts = sortedCharts.filter((item) => item.chartId !== chartId);
                if (editingUid === data.charts[chartId]?.uid) {
                    editingUid = null;
                }
                // TODO Show success to user
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const result = await response.json();
                // TODO Show error to user
            }
        } catch (error) {
            console.error('Error deleting chart:', error);
            // TODO Show error to user
        }
    }
</script>

<ul
    class="space-y-2"
    use:dndzone={{
        items: sortedCharts,
        flipDurationMs,
        dropTargetStyle: {}
    }}
    onconsider={handleDndConsider}
    onfinalize={handleDndFinalize}
>
    {#each sortedCharts as item (item.id)}
        {@const chartId = item.chartId}
        {@const chart = data.charts[chartId]}
        <li
            animate:flip={{ duration: flipDurationMs }}
            class="flex items-center gap-3 rounded-lg border px-4 py-3 transition {editingUid ===
            item.uid
                ? 'border-brand-400 bg-brand-50/60 dark:border-brand-600 dark:bg-brand-950/20'
                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-dark-700 dark:bg-dark-800 dark:hover:border-dark-600'}"
        >
            <div
                class="cursor-move text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                title="Drag to reorder"
            >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 8h16M4 16h16"
                    />
                </svg>
            </div>
            <div class="min-w-0 flex-1">
                <a
                    href={resolve(
                        `/plugin/${data.softwareUrl}/${data.plugin.name}/${data.plugin.id}#${chartId}`
                    )}
                    class="font-semibold text-slate-900 hover:text-brand-600 dark:text-slate-100"
                >
                    {chart?.title ?? chartId}
                </a>
                <span class="text-sm text-slate-500 dark:text-slate-400">(id: {chartId})</span>
                {#if chart?.type && DISABLED_CHART_TYPES.has(chart.type)}
                    <Badge type="gray" size="small" class="ml-2 align-middle">Disabled</Badge>
                {/if}
            </div>
            {#if item.uid >= 0 && chart?.type && EDITABLE_CHART_TYPES.has(chart.type)}
                <button
                    type="button"
                    onclick={() => {
                        savedNotice = false;
                        editingUid = item.uid;
                    }}
                    class="text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                    title="Edit chart"
                    aria-label="Edit chart {chart.title}"
                >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M16.862 4.487a2.06 2.06 0 112.913 2.913L7.5 19.675 3 21l1.325-4.5L16.862 4.487z"
                        />
                    </svg>
                </button>
            {/if}
            {#if chart && !chart.isDefault}
                <button
                    type="button"
                    onclick={() => deleteChart(chartId)}
                    class="text-rose-600 hover:text-rose-700"
                    title="Delete chart"
                >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                    </svg>
                </button>
            {:else if chart?.isDefault}
                <span
                    class="text-slate-300 dark:text-dark-500"
                    title="Default chart cannot be deleted"
                >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                    </svg>
                </span>
            {/if}
        </li>
    {/each}
</ul>

{#if editingChart}
    <div class="mt-6 border-t border-slate-200 pt-6 dark:border-dark-700">
        <div class="mb-4">
            <h3 class="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
                Edit chart
            </h3>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {editingChart.title}
                <span class="font-mono">(id: {editingChart.id})</span>
            </p>
            {#if savedNotice}
                <p class="mt-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    Chart updated successfully.
                </p>
            {/if}
        </div>
        {#key `${editingChart.uid}-${editorVersion}`}
            <EditChartForm
                chart={editingChart}
                onCancel={() => {
                    savedNotice = false;
                    editingUid = null;
                }}
                onSaved={handleSaved}
            />
        {/key}
    </div>
{/if}
