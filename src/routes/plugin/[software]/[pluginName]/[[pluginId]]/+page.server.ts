import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import * as dataManager from '$lib/server/dataManager.js';

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
		const plugin = await new Promise<any>((resolve, reject) => {
			dataManager.getPluginBySoftwareUrlAndName(
				softwareUrl,
				pluginName,
				['name', 'software', 'owner'],
				(err, result) => {
					if (err) reject(err);
					else resolve(result);
				}
			);
		});

		if (plugin === null) {
			throw redirect(302, `/plugin/${softwareUrl}/${pluginName}/-1`);
		}

		throw redirect(302, `/plugin/${softwareUrl}/${pluginName}/${plugin.id}`);
	}

	// Get plugin by ID
	const plugin = await new Promise<any>((resolve, reject) => {
		dataManager.getPluginById(pluginId, ['name', 'software', 'owner'], (err, result) => {
			if (err) reject(err);
			else resolve(result);
		});
	});

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
	const software = await new Promise<any>((resolve, reject) => {
		dataManager.getSoftwareById(plugin.software, ['name', 'url'], (err, result) => {
			if (err) reject(err);
			else resolve(result);
		});
	});

	// Redirect if software URL doesn't match
	if (software.url !== softwareUrl) {
		throw redirect(302, `/plugin/${software.url}/${plugin.name}/${plugin.id}`);
	}

	// Check if current user is owner
	const isOwner =
		locals.loggedIn &&
		locals.user &&
		locals.user.username.toLowerCase() === plugin.owner.toLowerCase();
	const isAdmin = locals.loggedIn && locals.user && locals.user.admin;

	return {
		unknownPlugin: false,
		plugin,
		software,
		isOwner: isOwner || isAdmin
	};
};

async function getRandomPlugin() {
	// Get all plugin IDs
	const pluginIds = await new Promise<string[]>((resolve, reject) => {
		dataManager.getAllPluginIds((err, ids) => {
			if (err) reject(err);
			else resolve(ids || []);
		});
	});

	// Get server count for 50 random plugins
	const promises = [];
	for (let i = 0; i < Math.min(50, pluginIds.length); i++) {
		const randomId = pluginIds[Math.floor(Math.random() * pluginIds.length)];
		promises.push(
			new Promise<{ pluginId: string; servers: number }>((resolve, reject) => {
				dataManager.getChartUidByPluginIdAndChartId(randomId, 'servers', (err, chartUid) => {
					if (err) {
						resolve({ pluginId: randomId, servers: 0 });
						return;
					}
					dataManager.getLimitedLineChartData(chartUid, 1, 1, (err, data) => {
						if (err) {
							resolve({ pluginId: randomId, servers: 0 });
							return;
						}
						const servers = data && data[0] ? data[0][1] : 0;
						resolve({ pluginId: randomId, servers });
					});
				});
			})
		);
	}

	const results = await Promise.all(promises);

	// Find first plugin with > 4 servers, or last one
	const selected = results.find((r) => r.servers > 4) || results[results.length - 1];

	// Get plugin details
	const plugin = await new Promise<any>((resolve, reject) => {
		dataManager.getPluginById(selected.pluginId, ['name', 'software'], (err, result) => {
			if (err) reject(err);
			else resolve(result);
		});
	});

	const software = await new Promise<any>((resolve, reject) => {
		dataManager.getSoftwareById(plugin.software, ['url'], (err, result) => {
			if (err) reject(err);
			else resolve(result);
		});
	});

	return {
		pluginId: plugin.id,
		pluginName: plugin.name,
		softwareUrl: software.url
	};
}
