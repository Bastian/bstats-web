import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAllSoftware } from '$lib/server/redis/software.js';
import { getPluginById, getAllPluginIds } from '$lib/server/redis/plugins.js';
import { getChartUidByPluginIdAndChartId } from '$lib/server/redis/charts.js';
import { getLimitedLineChartData } from '$lib/server/redis/chart-data.js';

export const GET: RequestHandler = async () => {
	try {
		// Get all plugin IDs
		const pluginIds = await getAllPluginIds();

		// Get all software to map IDs to names
		const allSoftware = await getAllSoftware(['name', 'url']);

		// Create a map for quick lookups
		const softwareMap = new Map();
		allSoftware.forEach((software) => {
			softwareMap.set(software.id, software);
		});

		// Get plugin data with server and player counts
		const pluginPromises = pluginIds.map(async (pluginId) => {
			try {
				// Get plugin basic data
				const plugin = await getPluginById(pluginId, ['name', 'software', 'owner']);

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
					const serversChartUid = await getChartUidByPluginIdAndChartId(pluginId, 'servers');

					if (serversChartUid) {
						const serversData = await getLimitedLineChartData(serversChartUid, '1', 1);
						if (serversData.length > 0) {
							servers = serversData[0][1];
						}
					}
				} catch (e) {
					// Ignore errors for individual chart data
				}

				// Get player count (from 'players' chart, latest data point)
				let players = 0;
				try {
					const playersChartUid = await getChartUidByPluginIdAndChartId(pluginId, 'players');

					if (playersChartUid) {
						const playersData = await getLimitedLineChartData(playersChartUid, '1', 1);
						if (playersData.length > 0) {
							players = playersData[0][1];
						}
					}
				} catch (e) {
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

		// Wait for all plugins to be processed
		const results = await Promise.all(pluginPromises);

		// Filter out null results
		const validResults = results.filter((r) => r !== null);

		return json(validResults);
	} catch (error) {
		console.error('Error fetching datatable data:', error);
		return json({ error: 'Failed to fetch plugin data' }, { status: 500 });
	}
};
