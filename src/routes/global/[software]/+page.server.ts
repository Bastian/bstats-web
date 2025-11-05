import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getSoftwareByUrl } from '$lib/server/redis/software.js';
import { getPluginById } from '$lib/server/redis/plugins.js';

export const load: PageServerLoad = async ({ params }) => {
    const { software: softwareUrl } = params;

    // Get software by URL
    const software = await getSoftwareByUrl(softwareUrl);

    if (!software || software.globalPlugin === null) {
        throw error(404, 'Software not found or has no global plugin');
    }

    // Get the global plugin
    const plugin = await getPluginById(software.globalPlugin);

    if (!plugin) {
        throw error(404, 'Global plugin not found');
    }

    return {
        software,
        plugin
    };
};
