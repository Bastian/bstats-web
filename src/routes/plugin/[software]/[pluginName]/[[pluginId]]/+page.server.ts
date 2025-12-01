import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getSoftwareById } from '$lib/server/redis/software.js';
import {
    getPluginBySoftwareUrlAndName,
    getPluginById,
    getAllPluginIds
} from '$lib/server/redis/plugins.js';
import { getChartUidByPluginIdAndChartId, getChartsByPluginId } from '$lib/server/redis/charts.js';
import { getLimitedLineChartData } from '$lib/server/redis/chart-data.js';
import type { ChartData } from '$lib/charts/chart-data';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ params, locals, fetch }) => {
    const { software: softwareUrl, pluginName, pluginId } = params;

    // Handle "random" plugin
    if (pluginName === 'random') {
        const randomPlugin = await getRandomPlugin();
        throw redirect(
            302,
            `/plugin/${randomPlugin.softwareUrl}/${randomPlugin.pluginName}/${randomPlugin.pluginId}`
        );
    }

    // If no pluginId provided, try to get it by software and name
    if (!pluginId) {
        const plugin = await getPluginBySoftwareUrlAndName(softwareUrl, pluginName);

        if (plugin === null) {
            throw redirect(302, `/plugin/${softwareUrl}/${pluginName}/-1`);
        }

        throw redirect(302, `/plugin/${softwareUrl}/${pluginName}/${plugin.id}`);
    }

    // Get plugin by ID
    const plugin = await getPluginById(parseInt(pluginId));

    // Handle unknown plugin
    if (plugin === null || plugin.name === null) {
        return {
            unknownPlugin: true,
            pluginName
        };
    }

    // Redirect if plugin name doesn't match
    if (plugin.name !== pluginName) {
        throw redirect(302, `/plugin/${softwareUrl}/${plugin.name}/${plugin.id}`);
    }

    // Get software details
    const software = await getSoftwareById(plugin.software as number);

    // Redirect if software URL doesn't match
    if (software.url !== softwareUrl) {
        throw redirect(302, `/plugin/${software.url}/${plugin.name}/${plugin.id}`);
    }

    // Check if current user is owner
    const isOwner =
        locals.user && locals.user.username
            ? locals.user.username.toLowerCase() === plugin.owner.toLowerCase()
            : false;
    const isAdmin = locals.user?.role === 'admin';

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
        unknownPlugin: false,
        plugin,
        software,
        isOwner: isOwner || isAdmin,
        chartMetadata,
        chartDataPromises
    };
};

async function getRandomPlugin() {
    const pluginIds = await getAllPluginIds();

    // Get server count for 50 random plugins
    const promises = [];
    for (let i = 0; i < Math.min(50, pluginIds.length); i++) {
        const randomId = pluginIds[Math.floor(Math.random() * pluginIds.length)];
        promises.push(
            (async () => {
                try {
                    const chartUid = await getChartUidByPluginIdAndChartId(randomId, 'servers');
                    if (!chartUid) {
                        return { pluginId: randomId, servers: 0 };
                    }
                    const data = await getLimitedLineChartData(chartUid, '1', 1);
                    const servers = data && data[0] ? data[0][1] : 0;
                    return { pluginId: randomId, servers };
                } catch {
                    return { pluginId: randomId, servers: 0 };
                }
            })()
        );
    }

    const results = await Promise.all(promises);

    // Find first plugin with > 4 servers, or last one
    const selected = results.find((r) => r.servers > 4) || results[results.length - 1];

    // Get plugin details
    const plugin = await getPluginById(selected.pluginId);

    if (!plugin) {
        throw new Error('Plugin not found');
    }

    const software = await getSoftwareById(plugin.software as number);

    return {
        pluginId: plugin.id,
        pluginName: plugin.name,
        softwareUrl: software.url
    };
}
