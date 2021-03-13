<script context="module" lang="ts">
    import type { Preload } from "@sapper/common";
    import {findService} from "../../api/findService";

    export const preload: Preload = async function(this, page, session) {
        const { id } = page.params;
        const { API_BASE_URL } = session;

        const service = await findService(API_BASE_URL, id, true, this.fetch);

        return { service };
    }
</script>

<script lang="ts">
    import {isSingleLineChart} from "../../definitions/single-line-chart.interface";
    import Navigation from "../../components/navigation/Navigation.svelte";
    import ServerIcon from "../../components/hero-icons/ServerIcon.svelte";
    import LineChart from "../../components/charts/LineChart.svelte";
    import UsersIcon from "../../components/hero-icons/UsersIcon.svelte";
    import type {Service} from "../../definitions/service.interface";
    import type {SingleLineChartData} from "../../definitions/chart-data/single-line-chart-data.interface";

    export let service: Service;
    let serversData: SingleLineChartData | null = null;
    let playersData: SingleLineChartData | null = null;

    let currentServers: number | null;
    let maxServers: number | null;

    let currentPlayers: number | null;
    let maxPlayers: number | null;

    $: {
        if (serversData) {
            currentServers = serversData[0][1];
            maxServers = serversData.reduce((prev, [, y]) => Math.max(prev, y), 0);
        }
        if (playersData) {
            currentPlayers = playersData[0][1];
            maxPlayers = playersData.reduce((prev, [, y]) => Math.max(prev, y), 0);
        }
    }
</script>

<style>
    @media (min-width: 1024px) {
        .servers-players-box {
            max-width: 700px;
        }
    }
</style>

<div class="text-white bg-gradient-to-r from-purple-900 via-blue-900 to-blue-400 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-700">
    <div class="container py-4 mx-auto">
        <Navigation/>

        <div class="pt-12">
            <div class="text-5xl sm:text-6xl py-4 font-semibold truncate">
                {service.name}
            </div>
            <div class="mb-4">
                by <a href="/" class="font-semibold">{service.owner.name}</a>
            </div>
        </div>

        <div class="flex justify-end pt-4 -mb-32 md:-mb-16">
            <div class="grid z-10 grid-cols-1 self-end p-6 w-full text-black bg-white rounded-md shadow-md md:grid-cols-2 dark:bg-gray-800 sm:p-8 servers-players-box dark:text-white">
                <div class="pb-4 sm:pl-4 md:pb-0">
                    <div class="inline-flex items-center text-gray-500 dark:text-gray-200">
                        <ServerIcon class="h-5 stroke-current"/>
                        <span class="pl-2 pt-0.5">Servers</span>
                    </div>
                    <div class="pt-2">
                        <span class="pr-1 text-4xl">
                            {currentServers ?? "???"}
                        </span>
                        <span class="text-gray-700 dark:text-gray-200">
                            / {maxServers ?? "???"}
                        </span>
                    </div>
                </div>
                <div class="pt-4 border-t sm:pl-4 md:pt-0 md:pl-8 md:border-l md:border-t-0">
                    <div class="inline-flex items-center text-gray-500 dark:text-gray-200">
                        <UsersIcon class="h-5 stroke-current"/>
                        <span class="pl-2 pt-0.5">Players</span>
                    </div>
                    <div class="pt-2">
                        <span class="pr-1 text-4xl">
                            {currentPlayers ?? "???"}
                        </span>
                        <span class="text-gray-700 dark:text-gray-200">
                            / {maxPlayers ?? "???"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="pt-28 bg-gray-100 dark:bg-gray-900 md:pt-12">
    <div class="container pt-4 pb-16 mx-auto">
        {#each service.charts as chart}
            {#if isSingleLineChart(chart) && chart.idCustom === "servers"}
                <LineChart chart={chart} bind:data={serversData}/>
            {:else if isSingleLineChart(chart) && chart.idCustom === "players"}
                <LineChart chart={chart} bind:data={playersData}/>
            {:else if isSingleLineChart(chart)}
                <LineChart chart={chart}/>
            {/if}
        {/each}
    </div>
</div>

