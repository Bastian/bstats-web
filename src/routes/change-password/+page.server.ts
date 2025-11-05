import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, depends }) => {
    depends('app:session');
    // Require authentication
    if (!locals.session || !locals.user) {
        throw redirect(303, '/login');
    }
};
