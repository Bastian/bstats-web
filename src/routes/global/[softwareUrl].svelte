<script context="module" lang="ts">
    import { findChartData } from "$api/findChartData";
    import { findService } from "$api/findService";
    import { findSoftwareByUrl } from "$api/findSoftwareByUrl";
    import type { ChartData } from "$defs/chart-data/chart-data.interface";
    import type { Chart } from "$defs/chart.interface";
    import type { Service } from "$defs/service.interface";
    import type { Load } from "@sveltejs/kit";
    import ServicePage from "../services/[id].svelte";

    export const load: Load = async ({ page, fetch, session }) => {
        const { softwareUrl } = page.params;
        const { API_BASE_URL } = session;

        const software = await findSoftwareByUrl(
            API_BASE_URL,
            softwareUrl,
            fetch
        );
        const service = await findService(
            API_BASE_URL,
            software.globalPlugin,
            true,
            fetch
        );

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
</script>

<ServicePage {service} {chartsWithData} />
