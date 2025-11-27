<script lang="ts">
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
    import type {
        LineChartData,
        ChartMetadata,
        ChartData,
        BarChartData,
        SimplePieChartData,
        DrilldownPieChartData,
        MapChartData
    } from '$lib/charts/chart-data';
    import { fetchChartData, fetchCharts } from '$lib/charts/chart-data';
    import Badge from '$lib/components/badge.svelte';
    import Button from '$lib/components/button.svelte';
    import { MetaTags } from 'svelte-meta-tags';
    import { getCanonicalUrl } from '$lib/utils/url';
    import PageHero from '$lib/components/page-hero.svelte';
    import BarChart from '$lib/components/charts/bar-chart.svelte';
    import ChartCard from '$lib/components/charts/chart-card.svelte';
    import DrilldownPieChart from '$lib/components/charts/drilldown-pie-chart.svelte';
    import LineChart from '$lib/components/charts/line-chart.svelte';
    import MapChart from '$lib/components/charts/map-chart.svelte';
    import PieChart from '$lib/components/charts/pie-chart.svelte';
    import type { PageData } from './$types';
    import IconServer from '@tabler/icons-svelte/icons/server';
    import IconUsers from '@tabler/icons-svelte/icons/users';
    import IconTool from '@tabler/icons-svelte/icons/edit';
    import IconLoader2 from '@tabler/icons-svelte/icons/loader-2';
    import IconDatabase from '@tabler/icons-svelte/icons/database';
    import IconAlertCircle from '@tabler/icons-svelte/icons/alert-circle';
    import ChartBadge from '$lib/components/chart-badge.svelte';

    let { data }: { data: PageData } = $props();

    const formatter = new Intl.NumberFormat();

    let serversCurrent = $state('--');
    let serversRecord = $state('--');
    let playersCurrent = $state('--');
    let playersRecord = $state('--');

    let charts = $state<ChartMetadata[]>([]);
    let chartDataMap = $state<Record<number, ChartData>>({});
    let fullDataLoadingMap = $state<Record<number, boolean>>({});
    let fullDataLoadedMap = $state<Record<number, boolean>>({});
    let fullDataErrorMap = $state<Record<number, string | null>>({});

    $effect(() => {
        initializeCharts();
    });

    async function initializeCharts() {
        if (!data.plugin) return;

        try {
            // Fetch chart metadata
            const chartsData = await fetchCharts(data.plugin.id);
            const chartIds = Object.keys(chartsData).sort(
                (a, b) => chartsData[a].position - chartsData[b].position
            );

            // Build charts array with metadata
            charts = chartIds.map((id) => ({
                id,
                uid: chartsData[id].uid,
                type: chartsData[id].type,
                title: chartsData[id].title,
                position: chartsData[id].position,
                data: chartsData[id].data
            }));

            // Fetch data for each chart
            for (const chart of charts) {
                try {
                    const maxElements =
                        chart.type === 'single_linechart' ? 2 * 24 * 365 : undefined;
                    const data = await fetchChartData(chart.uid, maxElements);
                    chartDataMap[chart.uid] = data;

                    // Update badges for special charts
                    if (chart.id === 'players' && Array.isArray(data) && data.length > 0) {
                        updatePlayersBadge(data as LineChartData);
                    } else if (chart.id === 'servers' && Array.isArray(data) && data.length > 0) {
                        updateServersBadge(data as LineChartData);
                    }
                } catch (error) {
                    console.error(`Failed to fetch data for chart ${chart.id}:`, error);
                }
            }

            // Scroll to anchor if present
            if (window.location.hash) {
                setTimeout(() => {
                    const target = document.querySelector(window.location.hash);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 800);
            }
        } catch (error) {
            console.error('Failed to initialize charts:', error);
        }
    }

    function updatePlayersBadge(chartData: LineChartData) {
        if (!Array.isArray(chartData) || !chartData.length) return;
        // Data is in reverse chronological order (newest first)
        const current = chartData[0][1];
        const record = chartData.reduce(
            (max: number, point: [number, number]) => Math.max(max, point[1]),
            0
        );
        playersCurrent = formatter.format(current);
        playersRecord = formatter.format(record);
    }

    function updateServersBadge(chartData: LineChartData) {
        if (!Array.isArray(chartData) || !chartData.length) return;
        // Data is in reverse chronological order (newest first)
        const current = chartData[0][1];
        const record = chartData.reduce(
            (max: number, point: [number, number]) => Math.max(max, point[1]),
            0
        );
        serversCurrent = formatter.format(current);
        serversRecord = formatter.format(record);
    }

    async function loadFullChartData(chart: ChartMetadata) {
        fullDataLoadingMap[chart.uid] = true;
        fullDataErrorMap[chart.uid] = null;

        try {
            const maxElements = 2 * 24 * 365 * 5; // 5 years (backend limit)
            const fullData = await fetchChartData(chart.uid, maxElements);

            chartDataMap[chart.uid] = fullData; // Triggers reactive chart update
            fullDataLoadedMap[chart.uid] = true;

            // Update badges if needed
            if (chart.id === 'players' && Array.isArray(fullData) && fullData.length > 0) {
                updatePlayersBadge(fullData as LineChartData);
            } else if (chart.id === 'servers' && Array.isArray(fullData) && fullData.length > 0) {
                updateServersBadge(fullData as LineChartData);
            }
        } catch (error) {
            console.error(`Failed to load full data for chart ${chart.id}:`, error);
            fullDataErrorMap[chart.uid] =
                error instanceof Error ? error.message : 'Failed to load full data';
        } finally {
            fullDataLoadingMap[chart.uid] = false;
        }
    }

    function getColSpan(chartType: string): 'single' | 'double' {
        switch (chartType) {
            case 'single_linechart':
            case 'simple_map':
            case 'advanced_map':
            case 'simple_bar':
            case 'advanced_bar':
                return 'double';
            default:
                return 'single';
        }
    }
</script>

{#if data.unknownPlugin}
    <MetaTags
        title="Unknown plugin - bStats"
        description="We don't have stats about {data.pluginName}."
        openGraph={{
            title: 'Unknown plugin',
            description: `We don't have stats about ${data.pluginName}.`,
            type: 'website',
            url: getCanonicalUrl(page.url),
            siteName: 'bStats',
            locale: 'en_US'
        }}
    />
{:else}
    <MetaTags
        title="{data.plugin?.name} - bStats"
        description="View statistics for {data.plugin?.name} by {data.plugin?.owner} on {data
            .software?.name}."
        openGraph={{
            title: data.plugin?.name,
            description: `View statistics for ${data.plugin?.name} by ${data.plugin?.owner} on ${
                data.software?.name
            }.`,
            type: 'website',
            url: getCanonicalUrl(page.url),
            siteName: 'bStats',
            locale: 'en_US'
        }}
    />
{/if}

{#if data.unknownPlugin}
    <main>
        <PageHero>
            {#snippet badge()}<Badge type="error">Unknown plugin</Badge>{/snippet}
            {#snippet title()}We couldn't find it{/snippet}
            {#snippet content()}
                Sorry, we don't have any stats about
                <span class="font-semibold text-slate-900">{data.pluginName}</span>. Maybe it hasn't
                been registered yet or the name is spelled differently
            {/snippet}
            {#snippet extra()}
                <div class="mt-6 flex flex-wrap justify-center gap-3">
                    <Button href={resolve('/plugin-list')}>Browse plugin list</Button>
                    <a
                        href={resolve('/add-plugin')}
                        class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-brand-200 hover:text-brand-700"
                    >
                        Register plugin
                    </a>
                </div>
            {/snippet}
        </PageHero>
    </main>
{:else}
    <main class="pb-24">
        <PageHero>
            {#snippet badge()}<Badge>{data.software?.name}</Badge>{/snippet}
            {#snippet title()}
                {data.plugin?.name}
            {/snippet}
            {#snippet content()}
                by
                <a
                    class="font-semibold text-brand-600 hover:text-brand-700"
                    href={resolve(`/author/${data.plugin?.owner}`)}
                >
                    {data.plugin?.owner}
                </a>
            {/snippet}
            {#snippet titleExtra()}
                {#if data.isOwner && data.plugin && data.software}
                    <a
                        href={resolve(
                            `/edit-plugin/${data.software.url}/${data.plugin.name}/${data.plugin.id}`
                        )}
                        class="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
                    >
                        <IconTool size={16} />
                        Edit
                    </a>
                {/if}
            {/snippet}
            {#snippet extra()}
                <div class="mt-6 grid w-full max-w-3xl gap-4 sm:grid-cols-2">
                    <ChartBadge title="Servers" current={serversCurrent} record={serversRecord}>
                        {#snippet icon()}
                            <IconServer size={16} />
                        {/snippet}
                    </ChartBadge>
                    <ChartBadge title="Players" current={playersCurrent} record={playersRecord}>
                        {#snippet icon()}
                            <IconUsers size={16} />
                        {/snippet}
                    </ChartBadge>
                </div>
            {/snippet}
        </PageHero>

        <section class="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
            <div class="flex flex-col gap-3 sm:gap-2">
                <h2 class="font-display text-3xl font-semibold text-slate-900">Charts</h2>
                <p class="text-sm text-slate-500">
                    Data updates every 30 minutes, on the hour and half hour.
                </p>
            </div>
            <div class="mt-8 grid gap-8 md:grid-cols-2">
                {#each charts as chart (chart.id)}
                    <ChartCard
                        title={chart.title}
                        chartId={chart.id}
                        colSpan={getColSpan(chart.type)}
                        supportsPatterns={chart.type !== 'simple_map' &&
                            chart.type !== 'advanced_map'}
                    >
                        {#snippet additionalButtons()}
                            {#if chartDataMap[chart.uid] && chart.type === 'single_linechart' && !fullDataLoadedMap[chart.uid]}
                                {@const isLoading = fullDataLoadingMap[chart.uid]}
                                {@const hasError = fullDataErrorMap[chart.uid]}
                                <button
                                    onclick={() => loadFullChartData(chart)}
                                    disabled={isLoading}
                                    class="inline-flex items-center gap-2 rounded-full border px-2 py-1 text-xs font-semibold transition focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                                    class:border-slate-200={!hasError}
                                    class:text-slate-500={!hasError && !isLoading}
                                    class:hover:border-slate-300={!hasError && !isLoading}
                                    class:hover:text-slate-600={!hasError && !isLoading}
                                    class:border-red-200={hasError}
                                    class:text-red-600={hasError}
                                    class:hover:border-red-300={hasError && !isLoading}
                                    class:hover:text-red-700={hasError && !isLoading}
                                    title={hasError
                                        ? `Error: ${hasError}`
                                        : 'Load all available historical data (up to 5 years)'}
                                    aria-label={hasError
                                        ? `Error loading data: ${hasError}. Click to retry.`
                                        : 'Load full data'}
                                >
                                    {#if isLoading}
                                        <IconLoader2 size={14} class="animate-spin" />
                                        Loading...
                                    {:else if hasError}
                                        <IconAlertCircle size={14} />
                                        Retry
                                    {:else}
                                        <IconDatabase size={14} />
                                        Load full data
                                    {/if}
                                </button>
                            {/if}
                        {/snippet}
                        {#if chartDataMap[chart.uid]}
                            {#if chart.type === 'simple_pie' || chart.type === 'advanced_pie'}
                                <PieChart data={chartDataMap[chart.uid] as SimplePieChartData[]} />
                            {:else if chart.type === 'drilldown_pie'}
                                <DrilldownPieChart
                                    data={chartDataMap[chart.uid] as DrilldownPieChartData}
                                />
                            {:else if chart.type === 'single_linechart'}
                                <LineChart
                                    data={chartDataMap[chart.uid] as LineChartData}
                                    lineName={chart.data?.lineName as string | undefined}
                                />
                            {:else if chart.type === 'simple_bar' || chart.type === 'advanced_bar'}
                                <BarChart
                                    data={chartDataMap[chart.uid] as BarChartData[]}
                                    categories={(chartDataMap[chart.uid] as BarChartData[])?.map(
                                        (d: BarChartData) => d.name
                                    ) || []}
                                    valueName={chart.data?.valueName as string | undefined}
                                />
                            {:else if chart.type === 'simple_map' || chart.type === 'advanced_map'}
                                <MapChart
                                    data={chartDataMap[chart.uid] as MapChartData[]}
                                    valueName={chart.data?.valueName as string | undefined}
                                />
                            {/if}
                        {:else}
                            <div class="flex h-72 items-center justify-center text-slate-500">
                                Loading chart data...
                            </div>
                        {/if}
                    </ChartCard>
                {/each}
            </div>
        </section>
    </main>
{/if}
