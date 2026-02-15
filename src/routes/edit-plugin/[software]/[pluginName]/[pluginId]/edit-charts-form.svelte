<script lang="ts">
    /*
     * TODO: This whole component is a mess and needs to be cleaned up.
     */
    import { resolve } from '$app/paths';

    import { dndzone } from 'svelte-dnd-action';
    import { flip } from 'svelte/animate';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    let sortedCharts = $state(
        Object.keys(data.charts || {})
            .sort((a, b) => (data.charts![a]?.position ?? 0) - (data.charts![b]?.position ?? 0))
            .map((chartId) => ({ id: chartId, chartId }))
    );

    $effect(() => {
        if (data.charts) {
            const charts = data.charts;
            sortedCharts = Object.keys(charts)
                .sort((a, b) => (charts[a]?.position ?? 0) - (charts[b]?.position ?? 0))
                .map((chartId) => ({ id: chartId, chartId }));
        }
    });

    const flipDurationMs = 200;
    let draggedItemOriginalIndex = $state(-1);

    function handleDndConsider(e: CustomEvent) {
        console.log('handleDndConsider called', e.detail);

        // Store the original index when drag starts
        if (e.detail.info.trigger === 'dragStarted') {
            for (let i = 0; i < sortedCharts.length; i++) {
                if (sortedCharts[i].id === e.detail.info.id) {
                    draggedItemOriginalIndex = i;
                    console.log('Drag started, original index:', draggedItemOriginalIndex);
                    break;
                }
            }
        }

        sortedCharts = e.detail.items;
    }

    async function handleDndFinalize(e: CustomEvent) {
        console.log('handleDndFinalize called', e.detail);
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
        console.log('oldIndex:', oldIndex, 'newIndex:', newIndex);

        sortedCharts = items;

        if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
            console.log('Sending reorder request...');
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

                console.log('Response:', response.status, response.ok);

                if (!response.ok) {
                    throw new Error('Failed to reorder charts');
                }
            } catch (error) {
                console.error('Failed to reorder charts:', error);
                // TODO Show error to user
            }
        } else {
            console.log('No reorder needed');
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
        <li
            animate:flip={{ duration: flipDurationMs }}
            class="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300 dark:border-dark-700 dark:bg-dark-800 dark:hover:border-dark-600"
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
                    {data.charts[chartId].title}
                </a>
                <span class="text-sm text-slate-500 dark:text-slate-400">(id: {chartId})</span>
            </div>
            {#if !data.charts[chartId].isDefault}
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
            {:else}
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
