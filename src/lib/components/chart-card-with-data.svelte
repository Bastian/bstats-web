<script lang="ts">
    import ChartCard from './charts/chart-card.svelte';
    import LineChart from './charts/line-chart.svelte';
    import PieChart from './charts/pie-chart.svelte';
    import DrilldownPieChart from './charts/drilldown-pie-chart.svelte';
    import BarChart from './charts/bar-chart.svelte';
    import MapChart from './charts/map-chart.svelte';
    import { fetchChartData } from '$lib/charts/chart-data';
    import type {
        ChartMetadata,
        ChartData,
        LineChartData,
        SimplePieChartData,
        DrilldownPieChartData,
        BarChartData,
        MapChartData
    } from '$lib/charts/chart-data';
    import IconLoader2 from '@tabler/icons-svelte/icons/loader-2';
    import IconDatabase from '@tabler/icons-svelte/icons/database';
    import IconAlertCircle from '@tabler/icons-svelte/icons/alert-circle';
    import { daysSince } from '$lib/utils/time';

    interface Props {
        chart: ChartMetadata;
        initialData?: ChartData | null;
        defaultMaxElements?: number;
        fullDataMaxElements?: number;
        onDataLoaded?: (chartId: string, data: ChartData) => void;
    }

    let {
        chart,
        initialData = null,
        defaultMaxElements,
        fullDataMaxElements = 2 * 24 * daysSince('2016-08-25'),
        onDataLoaded
    }: Props = $props();

    let chartData = $state<ChartData | null>(initialData);
    let isLoading = $state(!initialData);
    let fullDataLoading = $state(false);
    let fullDataLoaded = $state(false);
    let fullDataError = $state<string | null>(null);

    $effect(() => {
        if (!initialData) {
            loadInitialData();
        }
    });

    async function loadInitialData() {
        try {
            isLoading = true;
            const maxElements = chart.type === 'single_linechart' ? defaultMaxElements : undefined;
            const data = await fetchChartData(chart.uid, maxElements);
            chartData = data;
            onDataLoaded?.(chart.id, data);
        } catch (error) {
            console.error(`Failed to fetch data for chart ${chart.id}:`, error);
        } finally {
            isLoading = false;
        }
    }

    async function loadFullData() {
        fullDataLoading = true;
        fullDataError = null;

        try {
            const fullData = await fetchChartData(chart.uid, fullDataMaxElements);
            chartData = fullData;
            fullDataLoaded = true;
            onDataLoaded?.(chart.id, fullData);
        } catch (error) {
            console.error(`Failed to load full data for chart ${chart.id}:`, error);
            fullDataError = error instanceof Error ? error.message : 'Failed to load full data';
        } finally {
            fullDataLoading = false;
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

<ChartCard
    title={chart.title}
    chartId={chart.id}
    colSpan={getColSpan(chart.type)}
    supportsPatterns={chart.type !== 'simple_map' && chart.type !== 'advanced_map'}
>
    {#snippet additionalButtons()}
        {#if chartData && chart.type === 'single_linechart' && !fullDataLoaded}
            <button
                onclick={loadFullData}
                disabled={fullDataLoading}
                class="inline-flex items-center gap-2 rounded-full border px-2 py-1 text-xs font-semibold transition focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                class:border-slate-200={!fullDataError}
                class:text-slate-500={!fullDataError && !fullDataLoading}
                class:hover:border-slate-300={!fullDataError && !fullDataLoading}
                class:hover:text-slate-600={!fullDataError && !fullDataLoading}
                class:border-red-200={fullDataError}
                class:text-red-600={fullDataError}
                class:hover:border-red-300={fullDataError && !fullDataLoading}
                class:hover:text-red-700={fullDataError && !fullDataLoading}
                title={fullDataError
                    ? `Error: ${fullDataError}`
                    : 'Load all available historical data'}
                aria-label={fullDataError
                    ? `Error loading data: ${fullDataError}. Click to retry.`
                    : 'Load full data'}
            >
                {#if fullDataLoading}
                    <IconLoader2 size={14} class="animate-spin" />
                    Loading...
                {:else if fullDataError}
                    <IconAlertCircle size={14} />
                    Retry
                {:else}
                    <IconDatabase size={14} />
                    Load full data
                {/if}
            </button>
        {/if}
    {/snippet}

    {#if isLoading}
        <div class="flex h-72 items-center justify-center text-slate-500">
            Loading chart data...
        </div>
    {:else if chartData}
        {#if chart.type === 'simple_pie' || chart.type === 'advanced_pie'}
            <PieChart data={chartData as SimplePieChartData[]} />
        {:else if chart.type === 'drilldown_pie'}
            <DrilldownPieChart data={chartData as DrilldownPieChartData} />
        {:else if chart.type === 'single_linechart'}
            <LineChart
                data={chartData as LineChartData}
                lineName={chart.data?.lineName as string | undefined}
            />
        {:else if chart.type === 'simple_bar' || chart.type === 'advanced_bar'}
            <BarChart
                data={chartData as BarChartData[]}
                categories={(chartData as BarChartData[])?.map((d: BarChartData) => d.name) || []}
                valueName={chart.data?.valueName as string | undefined}
            />
        {:else if chart.type === 'simple_map' || chart.type === 'advanced_map'}
            <MapChart
                data={chartData as MapChartData[]}
                valueName={chart.data?.valueName as string | undefined}
            />
        {/if}
    {/if}
</ChartCard>
