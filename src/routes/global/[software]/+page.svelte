<script lang="ts">
    import { page } from '$app/state';
    import Badge from '$lib/components/badge.svelte';
    import PageHero from '$lib/components/page-hero.svelte';
    import { MetaTags } from 'svelte-meta-tags';
    import { getCanonicalUrl } from '$lib/utils/url';
    import ChartCard from '$lib/components/charts/chart-card.svelte';
    import ChartCardWithData from '$lib/components/chart-card-with-data.svelte';
    import type { LineChartData, ChartData } from '$lib/charts/chart-data';
    import type { PageData } from './$types';
    import IconServer from '@tabler/icons-svelte/icons/server';
    import IconUsers from '@tabler/icons-svelte/icons/users';
    import ChartBadge from '$lib/components/chart-badge.svelte';

    let { data }: { data: PageData } = $props();

    const formatter = new Intl.NumberFormat();

    let serversCurrent = $state('--');
    let serversRecord = $state('--');
    let playersCurrent = $state('--');
    let playersRecord = $state('--');

    // Scroll to anchor if present (client-side only)
    $effect(() => {
        if (typeof window !== 'undefined' && window.location.hash) {
            setTimeout(() => {
                const target = document.querySelector(window.location.hash);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 800);
        }
    });

    // Update badges when server data arrives
    $effect(() => {
        if (!data.chartDataPromises) return;

        // Find players and servers charts and update badges when promises resolve
        data.chartMetadata?.forEach(async (chart) => {
            try {
                const chartData = await data.chartDataPromises?.[chart.uid];
                if (chartData && Array.isArray(chartData) && chartData.length > 0) {
                    if (chart.id === 'players') {
                        updatePlayersBadge(chartData as LineChartData);
                    } else if (chart.id === 'servers') {
                        updateServersBadge(chartData as LineChartData);
                    }
                }
            } catch {
                // Ignore errors - will be handled by component
            }
        });
    });

    function handleDataLoaded(chartId: string, chartData: ChartData) {
        // Update badges for special charts
        if (chartId === 'players' && Array.isArray(chartData) && chartData.length > 0) {
            updatePlayersBadge(chartData as LineChartData);
        } else if (chartId === 'servers' && Array.isArray(chartData) && chartData.length > 0) {
            updateServersBadge(chartData as LineChartData);
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
</script>

<MetaTags
    title="Global {data.software.name} stats - bStats"
    description="View aggregated metrics across every plugin on bStats for {data.software
        .name} platform."
    openGraph={{
        title: `Global ${data.software.name} stats`,
        description: `View aggregated metrics across every plugin on bStats for ${data.software.name} platform.`,
        type: 'website',
        url: getCanonicalUrl(page.url),
        siteName: 'bStats',
        locale: 'en_US'
    }}
/>

<main class="pb-24">
    <PageHero>
        {#snippet badge()}<Badge>Global stats</Badge>{/snippet}
        {#snippet title()}{data.software.name}{/snippet}
        {#snippet content()}
            Aggregated metrics across every plugin reporting through bStats on {data.software.name}.
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
            {#each data.chartMetadata ?? [] as chart (chart.id)}
                {#await data.chartDataPromises?.[chart.uid]}
                    <!-- Loading state - just show empty card structure -->
                    <ChartCard
                        title={chart.title}
                        chartId={chart.id}
                        colSpan={chart.type === 'single_linechart' ||
                        chart.type === 'simple_map' ||
                        chart.type === 'advanced_map' ||
                        chart.type === 'simple_bar' ||
                        chart.type === 'advanced_bar'
                            ? 'double'
                            : 'single'}
                        supportsPatterns={chart.type !== 'simple_map' &&
                            chart.type !== 'advanced_map'}
                    >
                        <div class="flex h-72 items-center justify-center text-slate-500">
                            Loading chart data...
                        </div>
                    </ChartCard>
                {:then chartData}
                    <ChartCardWithData
                        {chart}
                        initialData={chartData}
                        defaultMaxElements={2 * 24 * 365}
                        fullDataMaxElements={2 * 24 * 365 * 15}
                        onDataLoaded={handleDataLoaded}
                    />
                {:catch}
                    <!-- Error - fallback to client-side fetch -->
                    <ChartCardWithData
                        {chart}
                        defaultMaxElements={2 * 24 * 365}
                        fullDataMaxElements={2 * 24 * 365 * 15}
                        onDataLoaded={handleDataLoaded}
                    />
                {/await}
            {/each}
        </div>
    </section>
</main>
