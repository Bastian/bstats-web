import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getSoftwareByUrl } from '$lib/server/redis/software.js';
import { getPluginById } from '$lib/server/redis/plugins.js';
import { getChartsByPluginId } from '$lib/server/redis/charts.js';
import type { ChartData } from '$lib/charts/chart-data';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ params, fetch }) => {
    const { software: softwareUrl } = params;

    // Get software by URL
    const software = await getSoftwareByUrl(softwareUrl);

    if (!software || software.globalPlugin === null) {
        throw error(404, 'Software not found or has no global plugin');
    }

    // Get the global plugin
    const plugin = await getPluginById(software.globalPlugin);

    if (!plugin) {
        throw error(404, 'Global plugin not found');
    }

    // Fetch chart metadata from Redis
    const charts = await getChartsByPluginId(plugin.id);
    const chartMetadata =
        charts
            ?.map((chart) => ({
                uid: chart.uid,
                id: chart.id,
                type: chart.type,
                title: chart.title,
                position: chart.position,
                data: chart.data as Record<string, unknown> | undefined
            }))
            .sort((a, b) => a.position - b.position) || [];

    if (!env.BACKEND_URL) {
        throw new Error('BACKEND_URL environment variable is not set.');
    }

    // Create promises for chart data that can be streamed to the client
    const chartDataPromises: Record<number, Promise<ChartData>> = {};

    for (const chart of chartMetadata) {
        const maxElements = chart.type === 'single_linechart' ? 2 * 24 * 365 : undefined;
        const chartDataUrl = maxElements
            ? `${env.BACKEND_URL}/charts/${chart.uid}/data?maxElements=${maxElements}`
            : `${env.BACKEND_URL}/charts/${chart.uid}/data`;

        chartDataPromises[chart.uid] = fetch(chartDataUrl)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch chart ${chart.id}: ${res.statusText}`);
                }
                return res.json();
            })
            .catch((error) => {
                console.error(`Error fetching chart ${chart.id}:`, error);
                // Reject promise to trigger catch block on client (will fallback to client-side fetch)
                throw error;
            });
    }

    return {
        software,
        plugin,
        chartMetadata,
        chartDataPromises
    };
};
