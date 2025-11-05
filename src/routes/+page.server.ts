import type { PageServerLoad } from './$types';
import { getRandomTop100Plugin } from '$lib/server/top-plugins-cache.js';

export const load: PageServerLoad = async () => {
    try {
        const spotlightPlugin = await getRandomTop100Plugin();

        return {
            spotlightPlugin
        };
    } catch (error) {
        console.error('Error fetching spotlight plugin:', error);
        return {
            spotlightPlugin: null
        };
    }
};
