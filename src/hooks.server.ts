import type { Handle } from '@sveltejs/kit';
import { ensureSchema } from '$lib/server/apply-schema';
import { migrateUsers } from '$lib/server/migrate-users';
import { getAuth } from '$lib/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';

// Apply database schema and migrate users on server startup
let initializationStarted = false;
if (!initializationStarted) {
    initializationStarted = true;
    ensureSchema()
        .then(async () => {
            console.log('✅ Schema initialization complete');
            // Run user migration after schema is ready
            try {
                await migrateUsers();
            } catch (error) {
                console.error('⚠️  User migration failed (non-fatal):', error);
                // Don't crash the server if migration fails
            }
        })
        .catch((error) => {
            console.error('❌ Failed to initialize database schema:', error);
            // Don't crash the server, but log the error
        });
}

export const handle: Handle = async ({ event, resolve }) => {
    // Fetch current session from Better Auth
    const session = await getAuth().api.getSession({
        headers: event.request.headers
    });

    // Make session and user available on server
    if (session) {
        event.locals.session = session.session;
        event.locals.user = session.user;
    }
    console.error('Handling request for:', event.url.pathname);
    return svelteKitHandler({ event, resolve, auth: getAuth(), building });
};
