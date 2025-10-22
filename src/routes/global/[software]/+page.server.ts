import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import * as dataManager from '$lib/server/dataManager.js';

export const load: PageServerLoad = async ({ params }) => {
	const { software: softwareUrl } = params;

	// Get software by URL
	const software = await dataManager.getSoftwareByUrl(softwareUrl, [
		'name',
		'url',
		'globalPlugin'
	]);

	if (!software || software.globalPlugin === null) {
		throw error(404, 'Software not found or has no global plugin');
	}

	// Get the global plugin
	const plugin = await dataManager.getPluginById(software.globalPlugin, [
		'name',
		'software',
		'owner'
	]);

	if (!plugin) {
		throw error(404, 'Global plugin not found');
	}

	return {
		software,
		plugin
	};
};
