import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAuth } from '$lib/auth';

export const POST: RequestHandler = async ({ locals }) => {
    // Require authentication
    if (!locals.session || !locals.user) {
        throw error(401, 'Authentication required');
    }

    const userId = locals.user.id;
    const tosAccepted = Date.now();

    const auth = getAuth();
    const ctx = await auth.$context;
    await ctx.adapter.update({
        model: 'user',
        update: { tosAccepted },
        where: [{ field: 'id', value: userId }]
    });

    return json({ success: true, tosAccepted });
};
