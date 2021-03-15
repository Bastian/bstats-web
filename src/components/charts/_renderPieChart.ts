import Chart from "chart.js";

import type {SimplePieChart} from "../../definitions/simple-pie-chart.interface";
import type {SimplePieChartData} from "../../definitions/chart-data/simple-pie-chart-data.interface";

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

export const renderPieChart = (chartDom, chart: SimplePieChart, data: SimplePieChartData): Chart => {
    new Chart(chartDom, {
        type: "pie",
        data: {
            datasets: [{
                data: data.map(({y}) => y),
                backgroundColor: PIE_COLORS,
                // TODO: Dark mode
                // borderColor: "#1E293B",
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: data.map(({name}) => name)
        },
        options: {
            maintainAspectRatio: false,
            legend: { display: false },
        }
    });
}
