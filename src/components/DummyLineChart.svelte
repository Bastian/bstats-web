<script lang="ts">
    import Chart from "chart.js";
    import {onMount} from "svelte";

    export let title;

    let chartDom;

    // TODO dynamically load data
    const d = [[1614949200000, 219136], [1614951000000, 225123], [1614952800000, 227459], [1614954600000, 229869], [1614956400000, 230259], [1614958200000, 232812], [1614960000000, 235918], [1614961800000, 238352], [1614963600000, 242529], [1614965400000, 247627], [1614967200000, 250866], [1614969000000, 250653], [1614970800000, 249294], [1614972600000, 247849], [1614974400000, 243410], [1614976200000, 234963], [1614978000000, 221784], [1614979800000, 209296], [1614981600000, 194511], [1614983400000, 180932], [1614985200000, 165763], [1614987000000, 153117], [1614988800000, 144128], [1614990600000, 138424], [1614992400000, 133208], [1614994200000, 132307], [1614996000000, 130830], [1614997800000, 130958], [1614999600000, 127871], [1615001400000, 126326], [1615003200000, 123139], [1615005000000, 121912], [1615006800000, 119992], [1615008600000, 119630], [1615010400000, 119576], [1615012200000, 121659], [1615014000000, 125830], [1615015800000, 132938], [1615017600000, 139891], [1615019400000, 149690], [1615021200000, 158056], [1615023000000, 168260], [1615024800000, 177419], [1615026600000, 186827], [1615028400000, 194627], [1615030200000, 200947], [1615032000000, 206992], [1615033800000, 213101], [1615035600000, 218744], [1615037400000, 222255], [1615039200000, 227064], [1615041000000, 232184], [1615042800000, 235297], [1615044600000, 240046], [1615046400000, 243463], [1615048200000, 247895], [1615050000000, 251670], [1615051800000, 256761], [1615053600000, 259176], [1615055400000, 258134], [1615057200000, 255035], [1615059000000, 250826], [1615060800000, 246503], [1615062600000, 241997], [1615064400000, 230161], [1615066200000, 216833], [1615068000000, 204114], [1615069800000, 190338], [1615071600000, 173869], [1615073400000, 163211], [1615075200000, 153116], [1615077000000, 147103], [1615078800000, 143247], [1615080600000, 141270], [1615082400000, 138812], [1615084200000, 138631], [1615086000000, 135946], [1615087800000, 135398], [1615089600000, 132218], [1615091400000, 130248], [1615093200000, 127798], [1615095000000, 125696], [1615096800000, 125155], [1615098600000, 126977], [1615100400000, 129395], [1615102200000, 134805], [1615104000000, 141522], [1615105800000, 150880], [1615107600000, 159764], [1615109400000, 170662], [1615111200000, 180070], [1615113000000, 191202], [1615114800000, 198578], [1615116600000, 205839], [1615118400000, 211723], [1615120200000, 217698]];

    const maxValue = d.reduce((prev, [, y]) => Math.max(prev, y), 0);

    onMount(() => {
        const chart = new Chart(chartDom, {
            type: "line",
            data: {
                datasets: [
                    {
                        data: d.map(([x, y]) => ({x: new Date(x), y})),
                        label: "Servers",
                        borderColor: "rgb(59, 130, 246)",
                        backgroundColor: "rgba(59, 130, 246, 0.6)",
                        borderWidth: 2,
                        fill: "origin",
                        pointRadius: 0,
                        order: 0,
                    },
                ],
            },
            options: {
                maintainAspectRatio: false,
                tooltips: {
                    axis: "x",
                    intersect: false,
                    titleFontFamily: "'Roboto', sans-serif",
                    titleFontSize: 15,
                    backgroundColor: "#fff",
                    titleFontColor: "#000",
                    bodyFontColor: "#444",
                    bodyFontFamily: "'Roboto', sans-serif",
                    bodyFontSize: 14,
                    xPadding: 12,
                    yPadding: 12,
                    caretPadding: 5,
                    borderColor: "#eee",
                    borderWidth: 2,
                },
                hover: {
                    axis: "x",
                    intersect: false,
                    animationDuration: 0,
                },
                layout: {
                    padding: {
                        left: 15,
                        right: 15,
                        top: 15,
                        bottom: 10,
                    },
                },
                legend: {
                    display: false,
                },
                scales: {
                    xAxes: [
                        {
                            type: "time",
                            time: {
                                unit: "day",
                            },
                            gridLines: {
                                display: false,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                                autoSkip: true,
                                maxTicksLimit: 6,
                                callback: (label) => {
                                    if (maxValue > 5000) {
                                        return `${label / 1000}k`;
                                    }
                                    return label;
                                },
                            },
                        },
                    ],
                },
            },
        });
    });
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

<div class="mt-8 sm:flex sm:flex-row sm:justify-between">
    <div class="inline-block text-2xl border-b-2 border-blue-800 dark:border-blue-400 dark:text-white">
        {title}
    </div>

    <div class="flex flex-wrap mr-0 sm:justify-end">
        {#each ["1d", "3d", "1w", "1m", "6m", "1y", "2y", "5y"] as text}
            <button
                class:font-semibold={text === "3d"}
                class="p-2 mt-2 mr-2 bg-white rounded-md sm:w-10 sm:mt-0 sm:mr-0 sm:ml-2 dark:hover:bg-gray-800 dark:text-gray-50 dark:bg-gray-700 hover:bg-gray-200 focus:outline-none focus:ring focus:border-blue-300"
            >
                {text}
            </button>
        {/each}
    </div>
</div>

<div class="p-0 pt-4 mt-4 bg-white rounded-md shadow-sm chart-container dark:bg-gray-800">
    <canvas bind:this={chartDom}></canvas>
</div>
