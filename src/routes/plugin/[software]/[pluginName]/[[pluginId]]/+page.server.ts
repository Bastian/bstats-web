import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getSoftwareById } from '$lib/server/redis/software.js';
import {
	getPluginBySoftwareUrlAndName,
	getPluginById,
	getAllPluginIds
} from '$lib/server/redis/plugins.js';
import { getChartUidByPluginIdAndChartId } from '$lib/server/redis/charts.js';
import { getLimitedLineChartData } from '$lib/server/redis/chart-data.js';

export const load: PageServerLoad = async ({ params, locals }) => {
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
		const plugin = await getPluginBySoftwareUrlAndName(softwareUrl, pluginName, [
			'name',
			'software',
			'owner'
		]);

		if (plugin === null) {
			throw redirect(302, `/plugin/${softwareUrl}/${pluginName}/-1`);
		}

		throw redirect(302, `/plugin/${softwareUrl}/${pluginName}/${plugin.id}`);
	}

	// Get plugin by ID
	const plugin = await getPluginById(parseInt(pluginId), ['name', 'software', 'owner']);

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
	const software = await getSoftwareById(plugin.software as number, ['name', 'url']);

	// Redirect if software URL doesn't match
	if (software.url !== softwareUrl) {
		throw redirect(302, `/plugin/${software.url}/${plugin.name}/${plugin.id}`);
	}

	// Check if current user is owner
	const isOwner = locals.user && locals.user.username.toLowerCase() === plugin.owner.toLowerCase();
	const isAdmin = locals.user && locals.user.admin;

	return {
		unknownPlugin: false,
		plugin,
		software,
		isOwner: isOwner || isAdmin
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
	const plugin = await getPluginById(selected.pluginId, ['name', 'software']);

	const software = await getSoftwareById(plugin?.software as number, ['url']);

	return {
		pluginId: plugin.id,
		pluginName: plugin.name,
		softwareUrl: software.url
	};
}
