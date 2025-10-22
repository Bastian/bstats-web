import type { PageServerLoad } from './$types';
import { getAllSoftware } from '$lib/server/redis/software.js';
import { getPluginsOfUser } from '$lib/server/redis/plugins.js';

export const load: PageServerLoad = async ({ params }) => {
	const { username } = params;

	// Get all plugins by the user
	const pluginsRaw = await getPluginsOfUser(username, [
		'name',
		'software',
		'charts',
		'owner',
		'global'
	]);

	// Get all software to map plugin software IDs to software objects
	const allSoftware = await getAllSoftware(['name', 'url', 'globalPlugin']);

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
