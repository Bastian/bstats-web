import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import * as dataManager from '$lib/server/dataManager.js';

export const load: PageServerLoad = async ({ params }) => {
	const { software: softwareUrl } = params;

	// Get software by URL
	const software = await new Promise<any>((resolve, reject) => {
		dataManager.getSoftwareByUrl(
			softwareUrl,
			['name', 'url', 'globalPlugin'],
			(err: any, result: any) => {
				if (err) reject(err);
				else resolve(result);
			}
		);
	});

	if (!software || software.globalPlugin === null) {
		throw error(404, 'Software not found or has no global plugin');
	}

	// Get the global plugin
	const plugin = await new Promise<any>((resolve, reject) => {
		dataManager.getPluginById(
			software.globalPlugin,
			['name', 'software', 'owner'],
			(err: any, result: any) => {
				if (err) reject(err);
				else resolve(result);
			}
		);
	});

	if (!plugin) {
		throw error(404, 'Global plugin not found');
	}

	return {
		software,
		plugin
	};
};
