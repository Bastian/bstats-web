import type { LayoutServerLoad } from './$types';
// @ts-ignore - CommonJS module
import * as dataManager from '$lib/server/dataManager.js';

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
	// Get custom color from cookies
	const customColor1 = cookies.get('custom-color1') || 'teal';

	// Get user and auth state from locals (set by hooks.server.ts)
	const user = locals.user;
	const loggedIn = locals.loggedIn;

	// Load all software
	const allSoftware = await new Promise<any[]>((resolve, reject) => {
		dataManager.getAllSoftware(['name', 'url', 'globalPlugin'], (err: any, software: any) => {
			if (err) reject(err);
			else resolve(software || []);
		});
	});

	// Load user's plugins if logged in
	const myPlugins = loggedIn && user
		? await new Promise<any[]>((resolve, reject) => {
				dataManager.getPluginsOfUser(user.username, ['name', 'software'], (err: any, plugins: any) => {
					if (err) reject(err);
					else resolve(plugins || []);
				});
			})
		: [];

	// Replace the software id with a proper object for myPlugins
	for (let i = 0; i < myPlugins.length; i++) {
		for (let j = 0; j < allSoftware.length; j++) {
			if (myPlugins[i].software === allSoftware[j].id) {
				myPlugins[i].software = allSoftware[j];
			}
		}
	}

	return {
		user,
		loggedIn,
		allSoftware,
		myPlugins,
		customColor1
	};
};
