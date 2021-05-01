import Chart, { TimeUnit } from "chart.js";

import type {SingleLineChartData} from "../../definitions/chart-data/single-line-chart-data.interface";
import type {SingleLineChart} from "../../definitions/single-line-chart.interface";

export const renderOrUpdateLineChart = (
    chartDom: HTMLCanvasElement,
    chartJsChart: Chart,
    chart: SingleLineChart, 
    data: SingleLineChartData
): Chart => {
    const maxValue = data.reduce((prev, [, y]) => Math.max(prev, y), 0);
    const labelCallback = (label) => {
        if (maxValue > 5000) {
            return `${label / 1000}k`;
        }
        return label;
    };
    const chartData = data.map(([x, y]) => ({x: new Date(x), y}));
    let unit: TimeUnit = "hour";
    if (data.length > 2 * 24 * 182.5) {
        unit = "quarter";
    } else if (data.length > 2 * 24 * 30) {
        unit = "month";
    } else if (data.length > 2 * 24 * 7) {
        unit = "week";
    } else if (data.length > 2 * 24) {
        unit = "day";
    }

    if (chartJsChart) {
        chartJsChart.data.datasets[0].data = chartData;
        chartJsChart.options.scales.yAxes[0].ticks.callback = labelCallback;
        chartJsChart.options.scales.xAxes[0].time.unit = unit;
        chartJsChart.update({duration: 0});
        return chartJsChart;
    } else {
        return new Chart(chartDom, {
            type: "line",
            data: {
                datasets: [
                    {
                        data: chartData,
                        label: chart.data.lineName,
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
                    enabled: false,
                    custom: function(tooltipModel: any) {
                        const tooltipId = `chart-tooltip-${chart.id}`;

                        // Tooltip Element
                        let tooltipEl = document.getElementById(tooltipId);

                        // Create element on first render
                        if (!tooltipEl) {
                            tooltipEl = document.createElement("div");
                            tooltipEl.id = tooltipId;
                            document.body.appendChild(tooltipEl);
                        }

                        // Hide if no tooltip
                        if (tooltipModel.opacity === 0) {
                            tooltipEl.classList.add("hidden");
                            return;
                        }
                        tooltipEl.classList.remove("hidden");

                        if (!tooltipModel.body) {
                            return;
                        }

                        const data: {
                            title: string,
                            label: string,
                            currentData: number,
                        } = tooltipModel.body[0].lines[0];

                        /* eslint max-len: ["off"] */
                        const innerHtml = `
                            <div class="text-gray-900 dark:text-gray-200 dark:bg-gray-700 shadow-lg bg-white p-2 rounded ring-2 ring-gray-500 dark:ring-gray-200 ring-opacity-25 dark:ring-opacity-25">
                                <div class="text-sm mb-2 border-b border-gray-500">
                                    ${data.title}
                                </div>
                                <div class="flex flex-row items-center">
                                    <div class="px-4 py-2 rounded-full mr-2" style="background-color: ${tooltipModel.labelColors[0].backgroundColor}"></div>
                                    <div class="flex flex-row items-baseline">
                                        <span class="font-bold mr-1">${data.label}:</span>
                                        <span>${data.currentData}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        const position = this._chart.canvas.getBoundingClientRect();

                        tooltipEl.innerHTML = innerHtml;
                        tooltipEl.style.position = "absolute";
                        const left = position.left + window.pageXOffset + tooltipModel.caretX;
                        tooltipEl.style.left = left + "px";
                        tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + "px";
                        tooltipEl.style.pointerEvents = "none";

                        // Prevent the item from flowing out of the window
                        if (left + tooltipEl.clientWidth >= window.innerWidth - 20) {
                            // Apply the style multiple times because the first update might change the bounding client rect
                            for (let i = 0; i < 4; i++) {
                                tooltipEl.style.left = position.left - window.pageXOffset - tooltipEl.getBoundingClientRect().width + tooltipModel.caretX + "px";
                            }
                        }
                    },
                    callbacks: {
                        label: function(tooltipItem, data): any {
                            const title = tooltipItem.label;
                            const label = data.datasets[tooltipItem.datasetIndex].label;
                            const currentData = parseInt(tooltipItem.value);

                            return {title, label, currentData};
                        }
                    }
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
                                unit: unit,
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
                                callback: labelCallback,
                            },
                        },
                    ],
                },
            },
        });
    }
};
