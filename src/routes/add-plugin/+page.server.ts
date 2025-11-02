import {
	addPlugin,
	getPluginBySoftwareUrlAndName,
	updatePluginCharts
} from '$lib/server/redis/plugins';
import { getAllSoftware, getSoftwareByUrl } from '$lib/server/redis/software.js';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createChart } from '$lib/server/redis/charts';

export const load: PageServerLoad = async ({ url }) => {
	// Check if user just added a plugin (from query params)
	const addedPlugin = url.searchParams.get('addedPlugin') === 'true';
	const pluginName = url.searchParams.get('pluginName') || '';
	const pluginId = url.searchParams.get('pluginId') || '';
	const initialPlatform = url.searchParams.get('platform');
	const initialBuildTool = url.searchParams.get('buildTool');

	// Get all software to show Metrics.java and example links
	const software = await getAllSoftware();

	return {
		software,
		addedPlugin,
		pluginName,
		pluginId,
		initialPlatform,
		initialBuildTool
	};
};

export const actions: Actions = {
	addPlugin: async ({ request, locals }) => {
		if (!locals.session || !locals.user || !locals.user.username) {
			return fail(401, { error: 'notAuthenticated' });
		}

		const data = await request.formData();
		const pluginName = data.get('pluginName')?.toString();
		const softwareUrl = data.get('platform')?.toString();

		if (!pluginName || !softwareUrl) {
			return fail(400, { error: 'missingData' });
		}

		const trimmedName = pluginName.trim().substring(0, 48);

		if (
			trimmedName.length === 0 ||
			trimmedName.length > 48 ||
			!/^[-_a-zA-Z0-9 ]+(\s[-_a-zA-Z0-9 ]+)*$/.test(trimmedName)
		) {
			return fail(400, { error: 'invalidName' });
		}

		const software = await getSoftwareByUrl(softwareUrl);

		if (!software) {
			return fail(404, { error: 'softwareNotFound' });
		}

		if (software.globalPlugin === null && !locals?.user?.admin) {
			return fail(403, { error: 'notAllowed' });
		}

		const existingPlugin = await getPluginBySoftwareUrlAndName(
			software.url,
			trimmedName.toLowerCase()
		);

		if (existingPlugin) {
			return fail(400, { error: 'duplicatePlugin' });
		}

		const pluginId = await addPlugin(
			{
				name: trimmedName,
				software: software.id!,
				charts: [],
				owner: locals.user.username
			},
			software
		);

		// Add default charts
		const chartUids: number[] = [];
		for (let i = 0; i < software.defaultCharts.length; i++) {
			const chartUid = await addChart(pluginId, trimmedName, software.defaultCharts[i], i);
			chartUids.push(chartUid);
		}

		// Update plugin with chart UIDs
		await updatePluginCharts(pluginId, chartUids);

		return {
			pluginId,
			pluginName: trimmedName,
			platform: software.url
		};
	}
};

async function addChart(
	pluginId: number,
	pluginName: string,
	chart: any,
	position: number
): Promise<number> {
	// Replace %plugin.name% in chart title
	const chartTitle = chart.title.replace('%plugin.name%', pluginName);

	const chartUid = await createChart(pluginId, {
		id: chart.id,
		type: chart.type,
		position,
		title: chartTitle,
		isDefault: true,
		data: chart.data
	});

	return chartUid;
}
