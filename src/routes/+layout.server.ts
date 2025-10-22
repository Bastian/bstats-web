import type { LayoutServerLoad } from './$types';
import { getAllSoftware } from '$lib/server/redis/software.js';
import { getPluginsOfUser } from '$lib/server/redis/plugins.js';

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
	// Get custom color from cookies
	const customColor1 = cookies.get('custom-color1') || 'teal';

	// Get user and auth state from locals (set by hooks.server.ts)
	const user = locals.user;
	const loggedIn = locals.loggedIn;

	// Load all software
	const allSoftware = await getAllSoftware(['name', 'url', 'globalPlugin']);

	// Load user's plugins if logged in
	const myPluginsRaw =
		loggedIn && user ? await getPluginsOfUser(user.username, ['name', 'software']) : [];

	// Replace the software id with a proper object for myPlugins
	const myPlugins = myPluginsRaw.map((plugin) => {
		const software = allSoftware.find((s) => s.id === plugin.software);
		return {
			...plugin,
			software: software || plugin.software
		};
	});

	return {
		user,
		loggedIn,
		allSoftware,
		myPlugins,
		customColor1
	};
};
