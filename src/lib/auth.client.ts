import { createAuthClient } from 'better-auth/svelte';
import { usernameClient, adminClient, inferAdditionalFields } from 'better-auth/client/plugins';
import { invalidate } from '$app/navigation';
import type { AppAuth } from './auth';

const client = createAuthClient({
    plugins: [usernameClient(), adminClient(), inferAdditionalFields<AppAuth>()]
});

export const authClient = {
    signOut: async (...args: Parameters<typeof client.signOut>) => {
        const response = await client.signOut(...args);
        await invalidate('app:session');
        return response;
    },
    signIn: {
        username: async (...args: Parameters<typeof client.signIn.username>) => {
            const response = await client.signIn.username(...args);
            if (!response.error) {
                await invalidate('app:session');
            }
            return response;
        },
        email: async (...args: Parameters<typeof client.signIn.email>) => {
            const response = await client.signIn.email(...args);
            if (!response.error) {
                await invalidate('app:session');
            }
            return response;
        }
    },
    signUp: {
        email: async (...args: Parameters<typeof client.signUp.email>) => {
            const response = await client.signUp.email(...args);
            if (!response.error) {
                await invalidate('app:session');
            }
            return response;
        }
    },
    changePassword: client.changePassword,
    admin: client.admin
};
