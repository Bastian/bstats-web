import type { LayoutServerLoad } from './$types';
import { getAllSoftware } from '$lib/server/redis/software.js';
import { getPluginsOfUser } from '$lib/server/redis/plugins.js';

export const load: LayoutServerLoad = async ({ locals, depends }) => {
	depends('app:session');
	// Load all software
	const allSoftware = await getAllSoftware();

	// Load user's plugins if logged in
	const myPluginsRaw =
		locals.session && locals.user?.username ? await getPluginsOfUser(locals.user.username) : [];

	// Replace the software id with a proper object for myPlugins
	const myPlugins = myPluginsRaw.map((plugin) => {
		const software = allSoftware.find((s) => s.id === plugin.software);
		if (!software) {
			throw new Error(`Software with ID ${plugin.software} not found for plugin ${plugin.name}`);
		}
		return {
			...plugin,
			software
		};
	});

	return {
		user: locals.user,
		session: locals.session,
		allSoftware,
		myPlugins
	};
};
