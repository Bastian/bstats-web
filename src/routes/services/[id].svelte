<script context="module" lang="ts">
    import { findChartData } from "$api/findChartData";
    import { findService } from "$api/findService";
    import { findSoftwareById } from "$api/findSoftwareById";
    import { session } from "$app/stores";
    import LineChart from "$components/charts/LineChart.svelte";
    import PieChart from "$components/charts/PieChart.svelte";
    import ServerIcon from "$components/hero-icons/ServerIcon.svelte";
    import UsersIcon from "$components/hero-icons/UsersIcon.svelte";
    import Navigation from "$components/navigation/Navigation.svelte";
    import type { ChartData } from "$defs/chart-data/chart-data.interface";
    import { isSimplePieChartData } from "$defs/chart-data/simple-pie-chart-data.interface";
    import { isSingleLineChartData } from "$defs/chart-data/single-line-chart-data.interface";
    import type { SingleLineChartData } from "$defs/chart-data/single-line-chart-data.interface";
    import type { Chart } from "$defs/chart.interface";
    import type { Service } from "$defs/service.interface";
    import { isSimplePieChart } from "$defs/simple-pie-chart.interface";
    import { isSingleLineChart } from "$defs/single-line-chart.interface";
    import type { Software } from "$defs/software/software.interface";
    import type { Load } from "@sveltejs/kit";

    export const load: Load = async ({ page, fetch, session }) => {
        const { id } = page.params;
        const { API_BASE_URL } = session;

        const service = await findService(
            API_BASE_URL,
            parseInt(id),
            true,
            fetch
        );

        if (service.isGlobal) {
            const software = await findSoftwareById(
                API_BASE_URL,
                service.software.id,
                fetch
            );
            return {
                status: 301,
                redirect: `/global/${software.url}`,
            };
        }

        // Prefetch all data
        const chartsWithData = await Promise.all(
            service.charts.map(async (chart) => ({
                chart,
                data: await findChartData(
                    API_BASE_URL,
                    chart.id,
                    2 * 24 * 7,
                    fetch
                ),
            }))
        );

        chartsWithData.sort((a, b) => a.chart.position - b.chart.position);

        return {
            props: { service, chartsWithData },
        };
    };
</script>

<script lang="ts">
    export let service: Service;
    export let chartsWithData: { chart: Chart; data: ChartData }[];

    let serviceName: string;
    $: if (service.isGlobal) {
        serviceName =
            ($session.softwareList as Software[]).find(
                (software) => software.id === service.software.id
            )?.name ?? service.name;
    } else {
        serviceName = service.name;
    }

    let currentServers: number | null;
    let maxServers: number | null;

    let currentPlayers: number | null;
    let maxPlayers: number | null;

    $: {
        let serversData: SingleLineChartData | undefined = chartsWithData.find(
            ({ chart }) => chart.idCustom === "servers"
        )?.data as SingleLineChartData;
        let playersData: SingleLineChartData | undefined = chartsWithData.find(
            ({ chart }) => chart.idCustom === "players"
        )?.data as SingleLineChartData;
        if (serversData) {
            currentServers = serversData[0][1];
            maxServers = serversData.reduce(
                (prev, [, y]) => Math.max(prev, y),
                0
            );
        }
        if (playersData) {
            currentPlayers = playersData[0][1];
            maxPlayers = playersData.reduce(
                (prev, [, y]) => Math.max(prev, y),
                0
            );
        }
    }
</script>

<svelte:head>
    <title>{serviceName}</title>
</svelte:head>

<div class="text-white bg-gradient-to-r from-blue-900 to-blue-700">
    <div class="container py-3 mx-auto">
        <Navigation />

        <div class="pt-16">
            <h1 class="block py-4 text-5xl font-semibold truncate sm:text-6xl">
                {serviceName}
            </h1>
            <div class="mb-4">
                {#if service.isGlobal}
                    Global Stats
                {:else}
                    by <a href="/" class="font-semibold">{service.owner.name}</a
                    >
                {/if}
            </div>
        </div>

        <div class="flex justify-end pt-4 -mb-32 md:-mb-16">
            <div
                class="z-10 grid self-end w-full grid-cols-1 p-6 text-black bg-white rounded-md shadow-md md:grid-cols-2 dark:bg-gray-800 sm:p-8 servers-players-box dark:text-white"
            >
                <article class="pb-4 sm:pl-4 md:pb-0">
                    <div
                        class="inline-flex items-center text-gray-500 dark:text-gray-200"
                    >
                        <ServerIcon class="h-5 stroke-current" />
                        <h3 class="pl-2 pt-0.5">Servers</h3>
                    </div>
                    <div class="pt-2">
                        <span class="pr-1 text-4xl">
                            {currentServers?.toLocaleString("en-US") ?? "???"}
                        </span>
                        <span class="text-gray-700 dark:text-gray-200">
                            / {maxServers?.toLocaleString("en-US") ?? "???"}
                        </span>
                    </div>
                </article>
                <article
                    class="pt-4 border-t sm:pl-4 md:pt-0 md:pl-8 md:border-l md:border-t-0"
                >
                    <div
                        class="inline-flex items-center text-gray-500 dark:text-gray-200"
                    >
                        <UsersIcon class="h-5 stroke-current" />
                        <h3 class="pl-2 pt-0.5">Players</h3>
                    </div>
                    <div class="pt-2">
                        <span class="pr-1 text-4xl">
                            {currentPlayers?.toLocaleString("en-US") ?? "???"}
                        </span>
                        <span class="text-gray-700 dark:text-gray-200">
                            / {maxPlayers?.toLocaleString("en-US") ?? "???"}
                        </span>
                    </div>
                </article>
            </div>
        </div>
    </div>
</div>

<div class="flex-grow bg-gray-100 pt-28 dark:bg-gray-900 md:pt-24 background">
    <div
        class="container grid grid-cols-1 pt-12 pb-16 mx-auto space-y-8 lg:grid-cols-2 2xl:grid-cols-3 gap-x-4"
    >
        {#each chartsWithData as { chart, data } (chart.id)}
            {#if isSingleLineChart(chart) && isSingleLineChartData(data)}
                <div class="lg:col-span-2 2xl:col-span-3">
                    <LineChart {chart} bind:data />
                </div>
            {/if}

            {#if isSimplePieChart(chart) && isSimplePieChartData(data)}
                <div>
                    <PieChart {chart} bind:data />
                </div>
            {/if}
        {/each}
    </div>
</div>

<style>
    @media (min-width: 1024px) {
        .servers-players-box {
            max-width: 700px;
        }
    }

    .background {
        background-image: url("/patterns/geometry-low-contrast-darker.png");
        background-repeat: repeat;
    }

    :global(.dark) .background {
        background-image: unset;
    }
</style>
