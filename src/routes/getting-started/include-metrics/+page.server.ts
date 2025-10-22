import type { PageServerLoad } from './$types';
import { getAllSoftware } from '$lib/server/redis/software.js';

export const load: PageServerLoad = async ({ url }) => {
	// Check if user just added a plugin (from query params)
	const addedPlugin = url.searchParams.get('addedPlugin') === 'true';
	const pluginName = url.searchParams.get('pluginName') || '';
	const pluginId = url.searchParams.get('pluginId') || '';

	// Get all software to show Metrics.java and example links
	const software = await getAllSoftware(['name', 'metricsClass', 'examplePlugin']);

	return {
		software,
		addedPlugin,
		pluginName,
		pluginId
	};
};
