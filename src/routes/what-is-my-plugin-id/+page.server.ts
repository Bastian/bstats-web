import type { PageServerLoad } from './$types';
import * as dataManager from '$lib/server/dataManager.js';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.loggedIn || !locals.user) {
		return {
			myPlugins: []
		};
	}

	// Get user's plugins
	const myPlugins = await new Promise<any[]>((resolve, reject) => {
		dataManager.getPluginsOfUser(
			locals.user.username,
			['name', 'software'],
			(err: any, result: any[]) => {
				if (err) reject(err);
				else resolve(result || []);
			}
		);
	});

	// Get all software to map plugin software IDs to software objects
	const allSoftware = await new Promise<any[]>((resolve, reject) => {
		dataManager.getAllSoftware(['name', 'url'], (err: any, result: any[]) => {
			if (err) reject(err);
			else resolve(result || []);
		});
	});

	// Replace software IDs with software objects
	for (let i = 0; i < myPlugins.length; i++) {
		for (let j = 0; j < allSoftware.length; j++) {
			if (myPlugins[i].software === allSoftware[j].id) {
				myPlugins[i].software = allSoftware[j];
				break;
			}
		}
	}

	return {
		myPlugins
	};
};
