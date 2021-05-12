import type { SimplePieChartData } from "$defs/chart-data/simple-pie-chart-data.interface";
import type { SimplePieChart } from "$defs/simple-pie-chart.interface";
import Chart from "chart.js";

export const PIE_COLORS = [
    "#3B82F6",
    "#EF4444",
    "#22C55E",
    "#F59E0B",
    "#A855F7",
    "#06B6D4",
    "#F97316",
    "#6366F1",
    "#10B981",
    "#64748B",
];

export const renderPieChart = (
    chartDom: HTMLCanvasElement,
    chart: SimplePieChart,
    data: SimplePieChartData
): Chart => {
    return new Chart(chartDom, {
        type: "pie",
        data: {
            datasets: [
                {
                    data: data.map(({ y }) => y),
                    backgroundColor: PIE_COLORS,
                },
            ],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: data.map(({ name }) => name),
        },
        options: {
            maintainAspectRatio: false,
            legend: { display: false },
            tooltips: {
                enabled: false,
                custom: function (tooltipModel: any) {
                    const tooltipId = `chart-tooltip-${chart.id}`;

                    // Tooltip Element
                    let tooltipEl = document.getElementById(tooltipId);

                    // Create element on first render
                    if (!tooltipEl) {
                        tooltipEl = document.createElement("div");
                        tooltipEl.id = tooltipId;
                        document.body.appendChild(tooltipEl);
                    }

                    tooltipEl.classList.add("transition-all");

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
                        label: string;
                        currentData: number;
                        percentage: number;
                    } = tooltipModel.body[0].lines[0];

                    /* eslint max-len: ["off"] */
                    const innerHtml = `
                        <div class="flex flex-row text-gray-900 dark:text-gray-200 dark:bg-gray-700 shadow-lg bg-white p-2 rounded items-center ring-2 ring-gray-500 dark:ring-gray-200 ring-opacity-25 dark:ring-opacity-25">
                            <div class="px-4 py-2 rounded-full mr-2" style="background-color: ${tooltipModel.labelColors[0].backgroundColor}"></div>
                            <div class="flex flex-row items-baseline">
                                <span class="font-bold mr-1">${data.label}:</span>
                                <span>${data.currentData} (${data.percentage}%)</span>
                            </div>
                        </div>
                    `;

                    const position = this._chart.canvas.getBoundingClientRect();

                    tooltipEl.innerHTML = innerHtml;
                    tooltipEl.style.position = "absolute";
                    tooltipEl.style.left =
                        position.left +
                        window.pageXOffset +
                        tooltipModel.caretX +
                        "px";
                    tooltipEl.style.top =
                        position.top +
                        window.pageYOffset +
                        tooltipModel.caretY +
                        "px";
                    tooltipEl.style.pointerEvents = "none";
                },
                callbacks: {
                    label: function (tooltipItem: any, data: any): any {
                        const label = data.labels[tooltipItem.index];
                        const totalData = data.datasets[
                            tooltipItem.datasetIndex
                        ].data.reduce((prev, curr) => prev + curr);
                        const currentData =
                            data.datasets[tooltipItem.datasetIndex].data[
                                tooltipItem.index
                            ];
                        const percentage =
                            Math.round((currentData * 1000) / totalData) / 10;

                        return { label, currentData, percentage };
                    },
                },
            },
        },
    });
};
