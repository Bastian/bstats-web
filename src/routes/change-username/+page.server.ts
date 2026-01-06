import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getAuth } from '$lib/auth';
import { migratePluginOwnership } from '$lib/server/redis/plugins';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ locals, depends }) => {
    depends('app:session');
    if (!locals.session || !locals.user) {
        throw redirect(303, '/login');
    }
    return {
        currentUsername: locals.user.displayUsername || locals.user.username
    };
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        if (!locals.session || !locals.user) {
            return fail(401, { error: 'Not authenticated' });
        }

        const formData = await request.formData();
        const newUsername = formData.get('username')?.toString().trim();

        if (!newUsername) {
            return fail(400, { error: 'Username is required' });
        }

        const oldUsername = locals.user.displayUsername || locals.user.username;
        if (!oldUsername) {
            return fail(400, { error: 'Could not determine current username' });
        }

        const auth = getAuth();
        const headers = new Headers(request.headers);

        // Check if username is available before attempting update
        const availabilityCheck = await auth.api.isUsernameAvailable({
            headers,
            body: { username: newUsername }
        });
        if (!availabilityCheck.available) {
            return fail(400, { error: 'This username is already taken' });
        }

        try {
            // Update via Better Auth server API with internal token to bypass HTTP hook
            // Update both username (login identifier) and name (display name) to keep them in sync
            headers.set('x-internal-username-change', env.BETTER_AUTH_SECRET!);
            await auth.api.updateUser({
                headers,
                body: { username: newUsername, name: newUsername }
            });
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Failed to update username';
            return fail(400, { error: message });
        }

        // Sync Redis plugin ownership
        await migratePluginOwnership(oldUsername, newUsername);

        // Redirect to the new author page - this forces a fresh session load
        // Must be outside try-catch because redirect() throws
        redirect(303, `/author/${newUsername}`);
    }
};
