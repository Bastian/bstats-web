import Chart from "chart.js";

import type {SingleLineChartData} from "../../definitions/chart-data/single-line-chart-data.interface";
import type {SingleLineChart} from "../../definitions/single-line-chart.interface";

export const renderOrUpdateLineChart = (chartDom, chartJsChart: Chart, chart: SingleLineChart, data: SingleLineChartData): Chart => {
    const maxValue = data.reduce((prev, [, y]) => Math.max(prev, y), 0);
    const labelCallback = (label) => {
        if (maxValue > 5000) {
            return `${label / 1000}k`;
        }
        return label;
    };
    const chartData = data.map(([x, y]) => ({x: new Date(x), y}));
    let unit = "hour";
    if (data.length > 2 * 24 * 182.5) {
        unit = "quarter"
    } else if (data.length > 2 * 24 * 30) {
        unit = "month"
    } else if (data.length > 2 * 24 * 7) {
        unit = "week"
    } else if (data.length > 2 * 24) {
        unit = "day"
    }

    if (chartJsChart) {
        chartJsChart.data.datasets[0].data = chartData;
        chartJsChart.options.scales.yAxes[0].ticks.callback = labelCallback;
        chartJsChart.options.scales.xAxes[0].time.unit = unit;
        chartJsChart.update(0);
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
}
