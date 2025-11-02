import { getAllSoftware } from '$lib/server/redis/software.js';
import { getPluginById, getAllPluginIds } from '$lib/server/redis/plugins.js';
import { getChartUidByPluginIdAndChartId } from '$lib/server/redis/charts.js';
import { getLimitedLineChartData } from '$lib/server/redis/chart-data.js';

interface CachedPlugin {
	name: string;
	pluginId: number;
	softwareName: string;
	softwareUrl: string;
	ownerName: string;
}

interface CacheEntry {
	plugins: CachedPlugin[];
	timestamp: number;
}

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes
let cache: CacheEntry | null = null;
let isRefreshing = false;

/**
 * Fetches and caches the top 100 plugins (without server/player counts)
 */
async function refreshCache(): Promise<void> {
	if (isRefreshing) return;
	isRefreshing = true;

	try {
		const pluginIds = await getAllPluginIds();
		const allSoftware = await getAllSoftware();

		// Create a map for quick lookups
		const softwareMap = new Map();
		allSoftware.forEach((software) => {
			softwareMap.set(software.id, software);
		});

		const pluginPromises = pluginIds.map(async (pluginId) => {
			try {
				const plugin = await getPluginById(pluginId);

				if (!plugin || plugin.name === null || plugin.global) {
					return null;
				}

				const software = softwareMap.get(plugin.software);
				const softwareName = software ? software.name : 'Unknown';
				const softwareUrl = software ? software.url : '';

				// Get latest server count to determine ranking
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
					console.error(`Error fetching server data for plugin ${pluginId}:`, e);
					return null;
				}

				return {
					name: plugin.name,
					pluginId: plugin.id,
					softwareName: softwareName,
					softwareUrl: softwareUrl,
					ownerName: plugin.owner,
					servers: servers
				};
			} catch (e) {
				console.error(`Error processing plugin ${pluginId}:`, e);
				return null;
			}
		});

		const results = await Promise.all(pluginPromises);
		const validResults = results.filter((r) => r !== null);
		validResults.sort((a, b) => (b?.servers || 0) - (a?.servers || 0));

		const top100 = validResults.slice(0, 100);

		// Store without server counts (we'll fetch those fresh)
		// Filter out any entries with missing required fields
		const cachedPlugins: CachedPlugin[] = [];
		for (const p of top100) {
			if (
				p &&
				typeof p.name === 'string' &&
				typeof p.pluginId === 'number' &&
				typeof p.ownerName === 'string'
			) {
				cachedPlugins.push({
					name: p.name,
					pluginId: p.pluginId,
					softwareName: p.softwareName,
					softwareUrl: p.softwareUrl,
					ownerName: p.ownerName
				});
			}
		}

		cache = {
			plugins: cachedPlugins,
			timestamp: Date.now()
		};
	} catch (error) {
		console.error('Error refreshing top plugins cache:', error);
	} finally {
		isRefreshing = false;
	}
}

/**
 * Gets a random plugin from the top 100 with fresh server/player counts
 */
export async function getRandomTop100Plugin(): Promise<{
	name: string;
	pluginId: number;
	softwareName: string;
	softwareUrl: string;
	ownerName: string;
	servers: number;
	players: number;
} | null> {
	// Initialize cache if needed
	if (!cache) {
		await refreshCache();
	}

	// Trigger background refresh if cache is stale (but don't wait for it)
	if (cache && Date.now() - cache.timestamp > CACHE_TTL) {
		// Fire and forget - don't await
		refreshCache().catch((e) => console.error('Background cache refresh failed:', e));
	}

	if (!cache || cache.plugins.length === 0) {
		return null;
	}

	// Pick a random plugin from the cached top 100
	const randomIndex = Math.floor(Math.random() * cache.plugins.length);
	const cachedPlugin = cache.plugins[randomIndex];

	// Fetch fresh server and player counts for this specific plugin
	let servers = 0;
	let players = 0;

	try {
		const serversChartUid = await getChartUidByPluginIdAndChartId(cachedPlugin.pluginId, 'servers');
		if (serversChartUid) {
			const serversData = await getLimitedLineChartData(serversChartUid, '1', 1);
			if (serversData.length > 0) {
				servers = serversData[0][1];
			}
		}
	} catch (e) {
		console.error(`Error fetching server data for plugin ${cachedPlugin.pluginId}:`, e);
		return null;
	}

	try {
		const playersChartUid = await getChartUidByPluginIdAndChartId(cachedPlugin.pluginId, 'players');
		if (playersChartUid) {
			const playersData = await getLimitedLineChartData(playersChartUid, '1', 1);
			if (playersData.length > 0) {
				players = playersData[0][1];
			}
		}
	} catch (e) {
		// Can happen for Server Implementations without a "players" chart.
		// But hopefully none of the top 100 plugins forgot to add it...
		console.error(`Error fetching player data for plugin ${cachedPlugin.pluginId}:`, e);
		return null;
	}

	return {
		...cachedPlugin,
		servers,
		players
	};
}
