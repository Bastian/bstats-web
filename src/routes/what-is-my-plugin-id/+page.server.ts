import type { PageServerLoad } from './$types';
import * as dataManager from '$lib/server/dataManager.js';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.loggedIn || !locals.user) {
		return {
			myPlugins: []
		};
	}

	// Get user's plugins
	const myPluginsRaw = await dataManager.getPluginsOfUser(locals.user.username, [
		'name',
		'software'
	]);

	// Get all software to map plugin software IDs to software objects
	const allSoftware = await dataManager.getAllSoftware(['name', 'url']);

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
