import type { PageServerLoad } from './$types';
import { getAllSoftware } from '$lib/server/redis/software.js';
import { getPluginsOfUser } from '$lib/server/redis/plugins.js';
import { getChartUidByPluginIdAndChartId } from '$lib/server/redis/charts.js';
import { getLimitedLineChartData } from '$lib/server/redis/chart-data.js';

export const load: PageServerLoad = async ({ params }) => {
    const { username } = params;

    // Get all plugins by the user
    const pluginsRaw = await getPluginsOfUser(username);

    // Get all software to map plugin software IDs to software objects
    const allSoftware = await getAllSoftware();

    // Replace software IDs with software objects and fetch server/player counts
    const plugins = await Promise.all(
        pluginsRaw.map(async (plugin) => {
            const software = allSoftware.find((s) => s.id === plugin.software);
            if (!software) {
                throw new Error(
                    `Software with ID ${plugin.software} not found for plugin ${plugin.name}`
                );
            }

            let servers = 0;
            let players = 0;

            try {
                const serversChartUid = await getChartUidByPluginIdAndChartId(
                    plugin.id,
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

            try {
                const playersChartUid = await getChartUidByPluginIdAndChartId(
                    plugin.id,
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
                ...plugin,
                software,
                servers,
                players
            };
        })
    );

    // Sort by server count (highest first)
    plugins.sort((a, b) => b.servers - a.servers);

    return {
        username,
        plugins
    };
};
