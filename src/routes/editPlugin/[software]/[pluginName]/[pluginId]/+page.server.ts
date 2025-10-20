import type { PageServerLoad, Actions } from './$types';
import { redirect, fail, error } from '@sveltejs/kit';
import * as dataManager from '$lib/server/dataManager.js';
import * as databaseManager from '$lib/server/databaseManager.js';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.loggedIn || !locals.user) {
		throw redirect(303, '/login');
	}

	const { software: softwareUrl, pluginName, pluginId } = params;

	// Get plugin data
	const plugin = await new Promise<any>((resolve, reject) => {
		dataManager.getPluginById(pluginId, ['owner', 'charts', 'name'], (err: any, result: any) => {
			if (err) reject(err);
			else resolve(result);
		});
	});

	if (!plugin) {
		throw error(404, 'Plugin not found');
	}

	// Redirect if plugin name doesn't match
	if (plugin.name !== pluginName) {
		throw redirect(303, `/editPlugin/${softwareUrl}/${plugin.name}/${pluginId}`);
	}

	// Check ownership
	const isOwner = plugin.owner === locals.user.username;
	const canEdit = isOwner || locals.user.admin;

	// Get all charts for the plugin
	const chartsArray = await Promise.all(
		plugin.charts.map(async (chartUid: number) => {
			return new Promise<any>((resolve, reject) => {
				dataManager.getChartByUid(
					chartUid,
					['id', 'type', 'position', 'title', 'default', 'data'],
					(err: any, chart: any) => {
						if (err) reject(err);
						else
							resolve({
								uid: chart.uid,
								id: chart.id,
								type: chart.type,
								position: chart.position,
								title: chart.title,
								isDefault: chart.default,
								data: chart.data
							});
					}
				);
			});
		})
	);

	// Convert charts array to object keyed by chart id
	const charts: Record<string, any> = {};
	for (const chart of chartsArray) {
		charts[chart.id] = {
			uid: chart.uid,
			type: chart.type,
			position: chart.position,
			title: chart.title,
			isDefault: chart.isDefault,
			data: chart.data
		};
	}

	return {
		plugin,
		isOwner,
		canEdit,
		charts,
		softwareUrl
	};
};

export const actions = {
	addChart: async ({ request, locals, params }) => {
		if (!locals.loggedIn || !locals.user) {
			return fail(401, { error: 'Not authenticated' });
		}

		const { pluginId } = params;
		const formData = await request.formData();

		// Get plugin
		const plugin = await new Promise<any>((resolve, reject) => {
			dataManager.getPluginById(pluginId, ['owner', 'charts', 'name'], (err: any, result: any) => {
				if (err) reject(err);
				else resolve(result);
			});
		});

		if (!plugin) {
			return fail(404, { error: 'Plugin not found' });
		}

		// Check permissions
		if (plugin.owner !== locals.user.username && !locals.user.admin) {
			return fail(401, { error: 'You are not allowed to edit this plugin' });
		}

		// Parse form data
		const chartType = formData.get('chart_type')?.toString();
		const chartId = formData.get('chartId')?.toString();
		const chartTitle = formData.get('chartTitle')?.toString();

		// Validate
		if (!chartType || !chartId || !chartTitle) {
			return fail(400, { error: 'Missing required fields' });
		}

		const trimmedTitle = chartTitle.substring(0, 50);
		const trimmedId = chartId.substring(0, 50);

		if (
			!/^[-_a-zA-Z0-9]+(\s[-_a-zA-Z0-9]+)*$/.test(trimmedTitle) ||
			!/^[-_a-zA-Z0-9]+([-_a-zA-Z0-9]+)*$/.test(trimmedId)
		) {
			return fail(400, { error: 'Invalid chart id or title' });
		}

		// Check if chart with this ID already exists
		const existingChart = await new Promise<any>((resolve, reject) => {
			dataManager.getChartByPluginIdAndChartId(
				pluginId,
				trimmedId,
				(err: any, result: any) => {
					if (err) reject(err);
					else resolve(result);
				}
			);
		});

		if (existingChart) {
			return fail(400, { error: 'Chart with this id already exists' });
		}

		// Build chart data based on type
		const chartData: any = {
			type: chartType,
			id: trimmedId,
			position: plugin.charts.length,
			isDefault: false,
			title: trimmedTitle,
			data: {}
		};

		// Complete chart data based on type
		const filterEnabled = formData.get('filterEnabled') === 'true';

		switch (chartType) {
			case 'simple_pie': {
				const regexEnabled = formData.get('regexEnabled') === 'true';
				const blacklistEnabled = formData.get('blacklistEnabled') === 'true';
				const filterStr = formData.get('filter')?.toString();
				const filter = filterStr ? JSON.parse(filterStr) : [];

				chartData.data.filter = {
					enabled: filterEnabled,
					useRegex: regexEnabled,
					blacklist: blacklistEnabled,
					filter: filter
				};
				break;
			}

			case 'advanced_pie':
			case 'drilldown_pie': {
				const regexEnabled = formData.get('regexEnabled') === 'true';
				const blacklistEnabled = formData.get('blacklistEnabled') === 'true';
				const maxValue = parseInt(formData.get('maxValue')?.toString() || '0');
				const filterStr = formData.get('filter')?.toString();
				const filter = filterStr ? JSON.parse(filterStr) : [];

				chartData.data.filter = {
					enabled: filterEnabled,
					maxValue: isNaN(maxValue) ? 0 : maxValue,
					useRegex: regexEnabled,
					blacklist: blacklistEnabled,
					filter: filter
				};
				break;
			}

			case 'single_linechart': {
				const lineName = formData.get('lineName')?.toString();
				if (!lineName) {
					return fail(400, { error: 'Invalid or missing line name' });
				}
				const trimmedLineName = lineName.substring(0, 50);
				if (!/^[-_a-zA-Z0-9]+(\s[-_a-zA-Z0-9]+)*$/.test(trimmedLineName)) {
					return fail(400, { error: 'Invalid or missing line name' });
				}
				const maxValue = parseInt(formData.get('maxValue')?.toString() || '2147483647');
				const minValue = parseInt(formData.get('minValue')?.toString() || '-2147483647');

				chartData.data.lineName = trimmedLineName;
				chartData.data.filter = {
					enabled: filterEnabled,
					minValue: isNaN(minValue) ? -2147483647 : minValue,
					maxValue: isNaN(maxValue) ? 2147483647 : maxValue
				};
				break;
			}

			default:
				return fail(400, { error: 'Invalid chart type' });
		}

		// Save chart
		try {
			await saveChart(plugin, chartData);
			return { success: true, chartId: trimmedId };
		} catch (err) {
			console.error('Error saving chart:', err);
			return fail(500, { error: 'Unknown error' });
		}
	},

	deleteChart: async ({ request, locals, params }) => {
		if (!locals.loggedIn || !locals.user) {
			return fail(401, { error: 'Not authenticated' });
		}

		const { pluginId } = params;
		const formData = await request.formData();
		const chartId = formData.get('chartId')?.toString();

		if (!chartId) {
			return fail(400, { error: 'Missing or invalid chart id' });
		}

		const plugin = await new Promise<any>((resolve, reject) => {
			dataManager.getPluginById(pluginId, ['owner', 'charts'], (err: any, result: any) => {
				if (err) reject(err);
				else resolve(result);
			});
		});

		if (!plugin) {
			return fail(404, { error: 'Plugin not found' });
		}

		if (plugin.owner !== locals.user.username && !locals.user.admin) {
			return fail(401, { error: 'You are not allowed to edit this plugin' });
		}

		const chart = await new Promise<any>((resolve, reject) => {
			dataManager.getChartByPluginIdAndChartId(
				pluginId,
				chartId,
				['default', 'position', 'type'],
				(err: any, result: any) => {
					if (err) reject(err);
					else resolve(result);
				}
			);
		});

		if (!chart) {
			return fail(404, { error: 'Unknown chart!' });
		}

		if (chart.default) {
			return fail(403, { error: 'You are not allowed to delete default charts!' });
		}

		const redis = databaseManager.getRedisCluster();

		// Delete chart
		await redis.del(`charts:${chart.uid}`);

		// Remove from plugin's charts array
		const index = plugin.charts.indexOf(chart.uid);
		if (index !== -1) {
			plugin.charts.splice(index, 1);
		}
		await redis.hset(`plugins:${pluginId}`, 'charts', JSON.stringify(plugin.charts));

		// Update positions of remaining charts
		const allCharts = await new Promise<any[]>((resolve, reject) => {
			dataManager.getChartsByPluginId(pluginId, ['position'], (err: any, result: any[]) => {
				if (err) reject(err);
				else resolve(result || []);
			});
		});

		for (const c of allCharts) {
			if (c.position > chart.position) {
				await redis.hset(`charts:${c.uid}`, 'position', c.position - 1);
			}
		}

		// Delete chart indexes
		await redis.del(`charts.index.uid.pluginId+chartId:${pluginId}.${chartId}`);
		await redis.srem('charts.uids', chart.uid);

		// Delete chart data if single_linechart
		if (chart.type === 'single_linechart') {
			await redis.del(`data:${chart.uid}.1`);
		}

		return { success: true };
	},

	reorderCharts: async ({ request, locals, params }) => {
		if (!locals.loggedIn || !locals.user) {
			return fail(401, { error: 'Not authenticated' });
		}

		const { pluginId } = params;
		const formData = await request.formData();
		const oldIndex = parseInt(formData.get('oldIndex')?.toString() || '');
		const newIndex = parseInt(formData.get('newIndex')?.toString() || '');

		if (isNaN(oldIndex) || isNaN(newIndex)) {
			return fail(400, { error: 'Invalid arguments' });
		}

		const plugin = await new Promise<any>((resolve, reject) => {
			dataManager.getPluginById(pluginId, ['owner'], (err: any, result: any) => {
				if (err) reject(err);
				else resolve(result);
			});
		});

		if (!plugin) {
			return fail(404, { error: 'Plugin not found' });
		}

		if (plugin.owner !== locals.user.username && !locals.user.admin) {
			return fail(401, { error: 'You are not allowed to edit this plugin' });
		}

		const charts = await new Promise<any[]>((resolve, reject) => {
			dataManager.getChartsByPluginId(pluginId, ['position'], (err: any, result: any[]) => {
				if (err) reject(err);
				else resolve(result || []);
			});
		});

		const redis = databaseManager.getRedisCluster();

		for (const chart of charts) {
			if (oldIndex > newIndex) {
				if (chart.position >= newIndex && chart.position < oldIndex) {
					await redis.hset(`charts:${chart.uid}`, 'position', chart.position + 1);
				}
			}
			if (oldIndex < newIndex) {
				if (chart.position > oldIndex && chart.position <= newIndex) {
					await redis.hset(`charts:${chart.uid}`, 'position', chart.position - 1);
				}
			}
			if (chart.position === oldIndex) {
				await redis.hset(`charts:${chart.uid}`, 'position', newIndex);
			}
		}

		return { success: true };
	},

	deletePlugin: async ({ locals, params }) => {
		if (!locals.loggedIn || !locals.user) {
			return fail(401, { error: 'Not authenticated' });
		}

		const { pluginId, software: softwareUrl } = params;

		const plugin = await new Promise<any>((resolve, reject) => {
			dataManager.getPluginById(pluginId, ['owner', 'charts', 'name'], (err: any, result: any) => {
				if (err) reject(err);
				else resolve(result);
			});
		});

		if (!plugin) {
			return fail(404, { error: 'Plugin not found' });
		}

		if (plugin.owner !== locals.user.username && !locals.user.admin) {
			return fail(401, { error: 'You are not allowed to delete this plugin' });
		}

		const redis = databaseManager.getRedisCluster();

		// Delete plugin from sets and hashes
		await redis.srem('plugins.ids', pluginId);
		await redis.del(`plugins:${pluginId}`);
		await redis.del(
			`plugins.index.id.url+name:${softwareUrl.toLowerCase()}.${plugin.name.toLowerCase()}`
		);
		await redis.srem(`users.index.plugins.username:${plugin.owner.toLowerCase()}`, pluginId);

		// Delete all charts
		for (const chartUid of plugin.charts) {
			const chart = await new Promise<any>((resolve, reject) => {
				dataManager.getChartByUid(chartUid, ['id', 'type'], (err: any, result: any) => {
					if (err) reject(err);
					else resolve(result);
				});
			});

			if (chart) {
				await redis.del(`charts.index.uid.pluginId+chartId:${pluginId}.${chart.id}`);
				await redis.del(`charts:${chartUid}`);
				await redis.srem('charts.uids', chartUid);

				if (chart.type === 'single_linechart') {
					await redis.del(`data:${chartUid}.1`);
				}
			}
		}

		throw redirect(303, '/');
	},

	transferOwnership: async ({ request, locals, params }) => {
		if (!locals.loggedIn || !locals.user) {
			return fail(401, { error: 'Not authenticated' });
		}

		if (!locals.user.admin) {
			return fail(401, { error: 'Only admins are allowed to transfer the ownership!' });
		}

		const { pluginId } = params;
		const formData = await request.formData();
		const newOwner = formData.get('newOwner')?.toString();

		if (!newOwner) {
			return fail(400, { error: 'Missing new owner' });
		}

		const plugin = await new Promise<any>((resolve, reject) => {
			dataManager.getPluginById(pluginId, ['owner'], (err: any, result: any) => {
				if (err) reject(err);
				else resolve(result);
			});
		});

		if (!plugin) {
			return fail(404, { error: 'Plugin not found' });
		}

		const redis = databaseManager.getRedisCluster();

		// Remove from old owner
		await redis.srem(`users.index.plugins.username:${plugin.owner.toLowerCase()}`, pluginId);

		// Add to new owner
		await redis.sadd(`users.index.plugins.username:${newOwner.toLowerCase()}`, pluginId);

		// Update owner field
		await redis.hset(`plugins:${pluginId}`, 'owner', newOwner);

		return { success: true, newOwner };
	}
} satisfies Actions;

async function saveChart(plugin: any, chartData: any): Promise<void> {
	const redis = databaseManager.getRedisCluster();

	// Increment chart UID
	const chartUid = await redis.incr('charts.uid-increment');

	// Create chart data for Redis
	const chartRedis: Record<string, string> = {
		pluginId: plugin.id.toString(),
		id: chartData.id,
		type: chartData.type,
		position: chartData.position.toString(),
		title: chartData.title,
		data: JSON.stringify(chartData.data)
	};

	// Store chart
	await redis.hmset(`charts:${chartUid}`, chartRedis);

	// Update plugin's charts array
	plugin.charts.push(chartUid);
	await redis.hset(`plugins:${plugin.id}`, 'charts', JSON.stringify(plugin.charts));

	// Create index
	await redis.set(`charts.index.uid.pluginId+chartId:${plugin.id}.${chartData.id}`, chartUid);

	// Add to charts set
	await redis.sadd('charts.uids', chartUid);
}
