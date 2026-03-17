import { redirect, error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getAuth } from '$lib/auth.js';
import { getPluginsOfUser } from '$lib/server/redis/plugins.js';

export const load: PageServerLoad = async ({ locals, depends, url }) => {
    depends('app:session');

    if (!locals.session || !locals.user) {
        return redirect(303, '/login');
    }
    if (locals.user.role !== 'admin') {
        return error(403, 'You do not have permission to access this page.');
    }

    const pageParam = Number(url.searchParams.get('page') ?? '1');
    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const search = url.searchParams.get('search')?.trim() ?? '';

    return {
        page,
        search
    };
};

export const actions: Actions = {
    deleteUser: async ({ request, locals }) => {
        if (!locals.session || !locals.user) {
            return fail(401, { error: 'Not authenticated' });
        }
        if (locals.user.role !== 'admin') {
            return fail(403, { error: 'You do not have permission to perform this action.' });
        }

        const formData = await request.formData();
        const userId = formData.get('userId');

        if (!userId || typeof userId !== 'string') {
            return fail(400, { error: 'Missing user ID.' });
        }

        const auth = getAuth();
        const headers = new Headers(request.headers);

        // Look up the user to get their username for the plugin check
        const targetUser = await auth.api.getUser({ headers, query: { id: userId } });
        if (!targetUser) {
            return fail(404, { error: 'User not found.' });
        }

        // Prevent deleting yourself
        if (targetUser.id === locals.user.id) {
            return fail(400, { error: 'You cannot delete your own account.' });
        }

        // Check if the user still owns any plugins
        const username = (targetUser as Record<string, unknown>).username as string | undefined;
        if (username) {
            const plugins = await getPluginsOfUser(username);
            if (plugins.length > 0) {
                const names = plugins.map((p) => p.name).join(', ');
                return fail(400, {
                    error: `Cannot delete user. They still own ${plugins.length} plugin(s): ${names}. Transfer or delete them first.`
                });
            }
        }

        await auth.api.removeUser({ headers, body: { userId } });

        return { deleted: true, name: targetUser.name ?? username ?? targetUser.email };
    }
};
