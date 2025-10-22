import type { PageServerLoad } from './$types';
import * as dataManager from '$lib/server/dataManager.js';

export const load: PageServerLoad = async ({ params }) => {
	const { username } = params;

	// Get all plugins by the user
	const pluginsRaw = await dataManager.getPluginsOfUser(username, [
		'name',
		'software',
		'charts',
		'owner',
		'global'
	]);

	// Get all software to map plugin software IDs to software objects
	const allSoftware = await dataManager.getAllSoftware(['name', 'url', 'globalPlugin']);

	// Replace software IDs with software objects
	const plugins = pluginsRaw.map((plugin) => {
		const software = allSoftware.find((s) => s.id === plugin.software);
		return {
			...plugin,
			software: software || plugin.software
		};
	});

	return {
		username,
		plugins
	};
};
