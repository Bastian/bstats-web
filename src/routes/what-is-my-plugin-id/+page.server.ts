import type { PageServerLoad } from './$types';
import { getAllSoftware } from '$lib/server/redis/software.js';
import { getPluginsOfUser } from '$lib/server/redis/plugins.js';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return {
			myPlugins: []
		};
	}

	// Get user's plugins
	const myPluginsRaw = await getPluginsOfUser(locals.user.username, ['name', 'software']);

	// Get all software to map plugin software IDs to software objects
	const allSoftware = await getAllSoftware(['name', 'url']);

	// Replace software IDs with software objects
	const myPlugins = myPluginsRaw.map((plugin) => {
		const software = allSoftware.find((s) => s.id === plugin.software);
		return {
			...plugin,
			software: software || plugin.software
		};
	});

	return {
		myPlugins
	};
};
