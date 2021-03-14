<script lang="ts">
    import Chart from "chart.js";
    import {onMount} from "svelte";
    import type {SingleLineChart} from "../../definitions/single-line-chart.interface";
    import {findChartData} from "../../api/findChartData";
    import type {SingleLineChartData} from "../../definitions/chart-data/single-line-chart-data.interface";
    import {stores} from '@sapper/app';
    import {renderOrUpdateLineChart} from "./_renderOrUpdateLineChart";
    import Spinner from "../Spinner.svelte";

    export let chart: SingleLineChart;
    export let data: SingleLineChartData;

    let loadingData = true;

    type RangeOption = { label: string, maxElements: number; }

    const rangeOptions: RangeOption[] = [
        {label: "1d", maxElements: 2 * 24},
        {label: "3d", maxElements: 2 * 24 * 3},
        {label: "1w", maxElements: 2 * 24 * 7},
        {label: "1m", maxElements: 2 * 24 * 30},
        {label: "6m", maxElements: 2 * 24 * 182.5},
        {label: "1y", maxElements: 2 * 24 * 365},
        {label: "2y", maxElements: 2 * 24 * 365 * 2},
        {label: "5y", maxElements: 2 * 24 * 365 * 5},
    ];

    let selectedRangeOption: RangeOption = rangeOptions[2];

    const {session} = stores();
    const {API_BASE_URL} = $session;

    const handleRangeOptionChange = (rangeOption: RangeOption) => {
        if (selectedRangeOption === rangeOption) {
            return;
        }
        selectedRangeOption = rangeOption;
        updateData(true);
    }

    const updateData = async (refreshData: boolean) => {
        loadingData = true;
        if (refreshData) {
            data = await findChartData(API_BASE_URL, chart.id, selectedRangeOption.maxElements) as SingleLineChartData;
        }
        loadingData = false;
        chartJsChart = renderOrUpdateLineChart(chartDom, chartJsChart, chart, data);
    }

    let chartDom;
    let chartJsChart: Chart;

    // Only refresh the data, if there was no data given to the chart
    onMount(() => updateData(data === null));
</script>

<style>
    .chart-container {
        position: relative;
        height: 250px;
        width: 100%;
    }

    @media (min-width: 640px) {
        .chart-container {
            height: 300px;
        }
    }

    @media (min-width: 1280px) {
        .chart-container {
            height: 350px;
        }
    }
</style>

<div class="sm:flex sm:flex-row sm:justify-between">
    <div class="inline-block text-2xl border-b-2 border-blue-800 dark:border-blue-400 dark:text-white">
        {#if chart.idCustom === "players"}
            Players
        {:else if chart.idCustom === "servers"}
            Servers
        {:else}
            {chart.title}
        {/if}
    </div>

    <div class="flex flex-wrap mr-0 sm:justify-end space-x-2">
        {#each rangeOptions as rangeOption}
            <button
                class:font-semibold={rangeOption === selectedRangeOption}
                class="p-2 mt-2 bg-white rounded-md sm:w-10 sm:mt-0 dark:hover:bg-gray-800 dark:text-gray-50 dark:bg-gray-700 hover:bg-gray-200 focus:outline-none focus:ring focus:border-blue-300"
                on:click={() => handleRangeOptionChange(rangeOption)}
            >
                {rangeOption.label}
            </button>
        {/each}
    </div>
</div>

<div class="relative p-0 pt-4 mt-4 bg-white rounded-md shadow-sm chart-container dark:bg-gray-800">
    {#if loadingData}
        <Spinner center class="h-16 w-16"/>
    {/if}
    <canvas class:hidden={loadingData} bind:this={chartDom}></canvas>
</div>
