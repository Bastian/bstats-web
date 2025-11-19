import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAuth } from '$lib/auth';

export const GET: RequestHandler = async ({ request }) => {
    // Sign out with Better Auth
    await getAuth().api.signOut({
        headers: request.headers
    });

    // Redirect to home
    throw redirect(303, '/');
};
