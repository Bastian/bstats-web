<script lang="ts">
    import type { SimplePieChartData } from "$defs/chart-data/simple-pie-chart-data.interface";
    import type { SimplePieChart } from "$defs/simple-pie-chart.interface";
    import ChartLabel from "./ChartLabel.svelte";
    import { PIE_COLORS, renderPieChart } from "./_renderPieChart";

    export let chart: SimplePieChart;
    export let data: SimplePieChartData;
    $: if (data) prepareData();
    let dataValueSum = 0;

    let chartDom: HTMLCanvasElement;

    function prepareData() {
        data.sort((a, b) => b.y - a.y);
        // Limit to a maximum of 10 elements
        data = data.reduce<SimplePieChartData>(
            (previousValue, currentValue, currentIndex) => {
                if (currentIndex < 10) {
                    previousValue.push(currentValue);
                } else {
                    previousValue[9].name = "Other";
                    previousValue[9].y += currentValue.y;
                }
                return previousValue;
            },
            []
        );

        dataValueSum = data.reduce((acc, cur) => acc + cur.y, 0);
    }

    let chartJsChart: unknown = null;
    $: if (chartDom && !chartJsChart) {
        chartJsChart = renderPieChart(chartDom, chart, data);
    }
</script>

<article class="flex flex-col h-full">
    <div class="sm:flex sm:flex-row sm:justify-between">
        <h3
            id="chart-title-{chart.id}"
            class="inline-block text-2xl border-b-2 border-blue-800 dark:border-blue-400 dark:text-white"
        >
            {chart.title}
        </h3>
    </div>

    <div
        class="relative flex-grow p-4 mt-4 text-gray-900 bg-white rounded-md shadow-sm dark:bg-gray-800 dark:text-gray-200"
    >
        <div class="p-2 chart-container">
            <canvas
                bind:this={chartDom}
                aria-labelledby="chart-title-{chart.id}"
                role="img"
            >
                {#if !data}
                    Data is still loading.
                {:else}
                    <table
                        summary="This is the text alternative for the canvas graphic."
                    >
                        <caption>
                            {chart.title}
                        </caption>
                        <tbody>
                            <tr>
                                <th scope="col">Field Name</th>
                                <th scope="col">Total Value</th>
                                <th scope="col">Percentage Value</th>
                            </tr>
                            <tr>
                                <th scope="row">Sum of all values</th>
                                <td>{dataValueSum}</td>
                                <td>100%</td>
                            </tr>
                            {#each data as dataPoint}
                                <tr>
                                    <th scope="row">{dataPoint.name}</th>
                                    <td>{dataPoint.y}</td>
                                    <td
                                        >{Math.round(
                                            (dataPoint.y * 100) / dataValueSum
                                        )}%</td
                                    >
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                {/if}
            </canvas>
        </div>
        <div class="flex flex-wrap justify-center p-4">
            {#each data as dataPoint, index}
                <ChartLabel
                    name={dataPoint.name}
                    color={PIE_COLORS[index % PIE_COLORS.length]}
                />
            {/each}
        </div>
    </div>
</article>

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
