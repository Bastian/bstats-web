<script lang="ts">
    import type {SimplePieChart} from "../../definitions/simple-pie-chart.interface";
    import type {SimplePieChartData} from "../../definitions/chart-data/simple-pie-chart-data.interface";
    import {renderPieChart} from "./_renderPieChart";
    import ChartLabel from "./ChartLabel.svelte";
    import {PIE_COLORS} from "./_renderPieChart";

    export let chart: SimplePieChart;
    export let data: SimplePieChartData;
    $: if (data) prepareData();

    let chartDom: unknown;

    function prepareData() {
        data.sort((a, b) => b.y - a.y);
        // Limit to a maximum of 10 elements
        data = data.reduce<SimplePieChartData>((previousValue, currentValue, currentIndex) => {
            if (currentIndex < 10) {
                previousValue.push(currentValue);
            } else {
                previousValue[9].name = "Other";
                previousValue[9].y += currentValue.y;
            }
            return previousValue;
        }, []);
    }

    $: if (chartDom) renderPieChart(chartDom, chart, data)
</script>

<style>
    .chart-container {
        position: relative;
        min-height: 200px;
        width: 100%;
    }

    @media (min-width: 640px) {
        .chart-container {
            min-height: 250px;
        }
    }

    @media (min-width: 1280px) {
        .chart-container {
            min-height: 300px;
        }
    }
</style>

<div class="flex flex-col h-full">
    <div class="sm:flex sm:flex-row sm:justify-between">
        <div class="inline-block text-2xl border-b-2 border-blue-800 dark:border-blue-400 dark:text-white">
            {chart.title}
        </div>
    </div>

    <div class="relative flex-grow p-4 mt-4 bg-white rounded-md shadow-sm dark:bg-gray-800 text-gray-900 dark:text-gray-200">
        <div class="chart-container p-2">
            <canvas bind:this={chartDom}></canvas>
        </div>
        <div class="p-4 flex flex-wrap justify-center">
            {#each data as dataPoint, index}
                <ChartLabel name={dataPoint.name} color={PIE_COLORS[index % PIE_COLORS.length]}/>
            {/each}
        </div>
    </div>
</div>
