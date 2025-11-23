import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAllSoftware } from '$lib/server/redis/software.js';
import { getPluginById, getAllPluginIds } from '$lib/server/redis/plugins.js';
import { getChartUidByPluginIdAndChartId } from '$lib/server/redis/charts.js';
import { getLimitedLineChartData } from '$lib/server/redis/chart-data.js';

export const GET: RequestHandler = async () => {
    try {
        const pluginIds = await getAllPluginIds();
        const allSoftware = await getAllSoftware();

        // Create a map for quick lookups
        const softwareMap = new Map();
        allSoftware.forEach((software) => {
            softwareMap.set(software.id, software);
        });

        // Get plugin data with server and player counts
        const pluginPromises = pluginIds.map(async (pluginId) => {
            try {
                const plugin = await getPluginById(pluginId);

                if (!plugin || plugin.name === null) {
                    return null; // Skip invalid plugins
                }

                // Get software name
                const software = softwareMap.get(plugin.software);
                const softwareName = software ? software.name : 'Unknown';
                const softwareUrl = software ? software.url : '';

                // Get server count (from 'servers' chart, latest data point)
                let servers = 0;
                try {
                    const serversChartUid = await getChartUidByPluginIdAndChartId(
                        pluginId,
                        'servers'
                    );

                    if (serversChartUid) {
                        const serversData = await getLimitedLineChartData(serversChartUid, '1', 1);
                        if (serversData.length > 0) {
                            servers = serversData[0][1];
                        }
                    }
                } catch {
                    // Ignore errors for individual chart data
                }

                if (servers === 0) {
                    // We don't want to show plugins with 0 servers
                    return null;
                }

                // Get player count (from 'players' chart, latest data point)
                let players = 0;
                try {
                    const playersChartUid = await getChartUidByPluginIdAndChartId(
                        pluginId,
                        'players'
                    );

                    if (playersChartUid) {
                        const playersData = await getLimitedLineChartData(playersChartUid, '1', 1);
                        if (playersData.length > 0) {
                            players = playersData[0][1];
                        }
                    }
                } catch {
                    // Ignore errors for individual chart data
                }

                return {
                    name: plugin.name,
                    pluginId: plugin.id,
                    softwareName: softwareName,
                    softwareUrl: softwareUrl,
                    ownerName: plugin.owner,
                    servers: servers,
                    players: players
                };
            } catch (e) {
                console.error(`Error processing plugin ${pluginId}:`, e);
                return null;
            }
        });

        const results = await Promise.all(pluginPromises);
        const validResults = results.filter((r) => r !== null);

        return json(validResults);
    } catch (error) {
        console.error('Error fetching datatable data:', error);
        return json({ error: 'Failed to fetch plugin data' }, { status: 500 });
    }
};
