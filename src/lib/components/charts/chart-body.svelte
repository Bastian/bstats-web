<script lang="ts">
    import type {
        BarChartData,
        ChartData,
        ChartMetadata,
        DrilldownPieChartData,
        LineChartData,
        MapChartData,
        SimplePieChartData
    } from '$lib/charts/chart-data';
    import BarChart from './bar-chart.svelte';
    import DrilldownPieChart from './drilldown-pie-chart.svelte';
    import LineChart from './line-chart.svelte';
    import MapChart from './map-chart.svelte';
    import PieChart from './pie-chart.svelte';

    // Renders chart data with the component matching the chart type. Shared by
    // plugin pages and the add-chart preview so both always look the same.
    interface Props {
        chart: Pick<ChartMetadata, 'type' | 'data'>;
        data: ChartData;
    }

    let { chart, data }: Props = $props();

    // The backend returns bar data as one entry per category
    // (`{ name: category, data: [valuePerBar] }`), but the chart component
    // expects series spanning all categories. Transpose: categories are the
    // map keys, and each bar index becomes a series.
    function toBarChart(data: BarChartData[], barLabels: string[] = []) {
        // The backend returns categories in Redis hash order, which is
        // effectively random. Sort them so ordered data (e.g. "00h".."23h")
        // is displayed in a meaningful order.
        const sorted = [...data].sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { numeric: true })
        );
        const categories = sorted.map((d) => d.name);
        const barCount = sorted.reduce((max, d) => Math.max(max, d.data.length), 0);
        const series = Array.from({ length: barCount }, (_, barIndex) => ({
            name: barLabels[barIndex]?.trim() || `Series ${barIndex + 1}`,
            data: sorted.map((d) => d.data[barIndex] ?? 0)
        }));
        return { categories, series };
    }
</script>

{#if chart.type === 'simple_pie' || chart.type === 'advanced_pie'}
    <PieChart data={data as SimplePieChartData[]} />
{:else if chart.type === 'drilldown_pie'}
    <DrilldownPieChart data={data as DrilldownPieChartData} />
{:else if chart.type === 'single_linechart'}
    <LineChart data={data as LineChartData} lineName={chart.data?.lineName as string | undefined} />
{:else if chart.type === 'simple_bar' || chart.type === 'advanced_bar'}
    {#if (data as BarChartData[]).length === 0}
        <div class="flex h-72 items-center justify-center text-slate-500">
            No data available yet
        </div>
    {:else}
        {@const bars = toBarChart(
            data as BarChartData[],
            (chart.data?.barLabels as string[] | undefined) ?? []
        )}
        <BarChart
            data={bars.series}
            categories={bars.categories}
            valueName={chart.data?.valueName as string | undefined}
            orientation={chart.data?.orientation as 'horizontal' | 'vertical' | undefined}
        />
    {/if}
{:else if chart.type === 'simple_map' || chart.type === 'advanced_map'}
    <MapChart
        data={data as MapChartData[]}
        valueName={chart.data?.valueName as string | undefined}
    />
{/if}
