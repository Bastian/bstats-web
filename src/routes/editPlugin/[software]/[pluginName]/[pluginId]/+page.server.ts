import type { PageServerLoad, Actions } from './$types';
import { redirect, fail, error } from '@sveltejs/kit';
import {
	getPluginById,
	updatePluginCharts,
	deletePlugin,
	deletePluginIndex,
	removePluginFromPluginIds,
	removePluginFromUser,
	transferPluginOwnership
} from '$lib/server/redis/plugins.js';
import {
	getChartByUid,
	getChartByPluginIdAndChartId,
	deleteChart,
	getChartsByPluginId,
	updateChartPosition,
	deleteChartIndex,
	removeChartFromUids,
	createChart
} from '$lib/server/redis/charts.js';
import { deleteChartLineData } from '$lib/server/redis/chart-data.js';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.loggedIn || !locals.user) {
		throw redirect(303, '/login');
	}

	const { software: softwareUrl, pluginName, pluginId } = params;

	// Get plugin data
	const plugin = await getPluginById(parseInt(pluginId), ['owner', 'charts', 'name']);

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
			const chart = await getChartByUid(chartUid, [
				'id',
				'type',
				'position',
				'title',
				'default',
				'data'
			]);
			return {
				uid: chart?.uid,
				id: chart?.id,
				type: chart?.type,
				position: chart?.position,
				title: chart?.title,
				isDefault: chart?.default,
				data: chart?.data
			};
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
		const plugin = await getPluginById(parseInt(pluginId), ['owner', 'charts', 'name']);

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
		const existingChart = await getChartByPluginIdAndChartId(parseInt(pluginId), trimmedId);

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

		const plugin = await getPluginById(parseInt(pluginId), ['owner', 'charts']);

		if (!plugin) {
			return fail(404, { error: 'Plugin not found' });
		}

		if (plugin.owner !== locals.user.username && !locals.user.admin) {
			return fail(401, { error: 'You are not allowed to edit this plugin' });
		}

		const chart = await getChartByPluginIdAndChartId(parseInt(pluginId), chartId, [
			'default',
			'position',
			'type'
		]);

		if (!chart) {
			return fail(404, { error: 'Unknown chart!' });
		}

		if (chart.default) {
			return fail(403, { error: 'You are not allowed to delete default charts!' });
		}

		// Delete chart
		await deleteChart(chart.uid);

		// Remove from plugin's charts array
		const index = plugin.charts.indexOf(chart.uid);
		if (index !== -1) {
			plugin.charts.splice(index, 1);
		}
		await updatePluginCharts(parseInt(pluginId), plugin.charts);

		// Update positions of remaining charts
		const allCharts = (await getChartsByPluginId(parseInt(pluginId), ['position'])) || [];

		for (const c of allCharts) {
			if (c.position! > chart.position!) {
				await updateChartPosition(c.uid!, c.position! - 1);
			}
		}

		// Delete chart indexes
		await deleteChartIndex(parseInt(pluginId), chartId);
		await removeChartFromUids(chart.uid);

		// Delete chart data if single_linechart
		if (chart.type === 'single_linechart') {
			await deleteChartLineData(chart.uid);
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

		const plugin = await getPluginById(parseInt(pluginId), ['owner']);

		if (!plugin) {
			return fail(404, { error: 'Plugin not found' });
		}

		if (plugin.owner !== locals.user.username && !locals.user.admin) {
			return fail(401, { error: 'You are not allowed to edit this plugin' });
		}

		const charts = (await getChartsByPluginId(parseInt(pluginId), ['position'])) || [];

		for (const chart of charts) {
			if (oldIndex > newIndex) {
				if (chart.position! >= newIndex && chart.position! < oldIndex) {
					await updateChartPosition(chart.uid!, chart.position! + 1);
				}
			}
			if (oldIndex < newIndex) {
				if (chart.position! > oldIndex && chart.position! <= newIndex) {
					await updateChartPosition(chart.uid!, chart.position! - 1);
				}
			}
			if (chart.position === oldIndex) {
				await updateChartPosition(chart.uid!, newIndex);
			}
		}

		return { success: true };
	},

	deletePlugin: async ({ locals, params }) => {
		if (!locals.loggedIn || !locals.user) {
			return fail(401, { error: 'Not authenticated' });
		}

		const { pluginId, software: softwareUrl } = params;

		const plugin = await getPluginById(parseInt(pluginId), ['owner', 'charts', 'name']);

		if (!plugin) {
			return fail(404, { error: 'Plugin not found' });
		}

		if (plugin.owner !== locals.user.username && !locals.user.admin) {
			return fail(401, { error: 'You are not allowed to delete this plugin' });
		}

		// Delete plugin from sets and hashes
		await removePluginFromPluginIds(parseInt(pluginId));
		await deletePlugin(parseInt(pluginId));
		await deletePluginIndex(softwareUrl, plugin.name!);
		await removePluginFromUser(plugin.owner!, parseInt(pluginId));

		// Delete all charts
		for (const chartUid of plugin.charts as number[]) {
			const chart = await getChartByUid(chartUid, ['id', 'type']);

			if (chart) {
				await deleteChartIndex(parseInt(pluginId), chart.id!);
				await deleteChart(chartUid);
				await removeChartFromUids(chartUid);

				if (chart.type === 'single_linechart') {
					await deleteChartLineData(chartUid);
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

		const plugin = await getPluginById(parseInt(pluginId), ['owner']);

		if (!plugin) {
			return fail(404, { error: 'Plugin not found' });
		}

		await transferPluginOwnership(parseInt(pluginId), plugin.owner!, newOwner);

		return { success: true, newOwner };
	}
} satisfies Actions;

async function saveChart(plugin: any, chartData: any): Promise<void> {
	// Create chart and get its UID
	const chartUid = await createChart(plugin.id, {
		id: chartData.id,
		type: chartData.type,
		position: chartData.position,
		title: chartData.title,
		isDefault: chartData.isDefault,
		data: chartData.data
	});

	// Update plugin's charts array
	plugin.charts.push(chartUid);
	await updatePluginCharts(plugin.id, plugin.charts);
}
