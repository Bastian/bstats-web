import type { PageServerLoad } from './$types';
import * as dataManager from '$lib/server/dataManager.js';

export const load: PageServerLoad = async ({ params }) => {
	const { username } = params;

	// Get all plugins by the user
	const plugins = await new Promise<any[]>((resolve, reject) => {
		dataManager.getPluginsOfUser(
			username,
			['name', 'software', 'charts', 'owner', 'global'],
			(err, result) => {
				if (err) reject(err);
				else resolve(result || []);
			}
		);
	});

	// Get all software to map plugin software IDs to software objects
	const allSoftware = await new Promise<any[]>((resolve, reject) => {
		dataManager.getAllSoftware(['name', 'url', 'globalPlugin'], (err, result) => {
			if (err) reject(err);
			else resolve(result || []);
		});
	});

	// Replace software IDs with software objects
	for (let i = 0; i < plugins.length; i++) {
		for (let j = 0; j < allSoftware.length; j++) {
			if (plugins[i].software === allSoftware[j].id) {
				plugins[i].software = allSoftware[j];
				break;
			}
		}
	}

	return {
		username,
		plugins
	};
};
