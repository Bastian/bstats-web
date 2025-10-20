import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { verifyCredentials, createSession } from '$lib/server/auth-simple';

export const load: PageServerLoad = async ({ url, locals }) => {
	// If already logged in, redirect to home
	if (locals.loggedIn) {
		throw redirect(303, '/');
	}

	return {
		failed: url.searchParams.get('failed') === 'true',
		registered: url.searchParams.get('registered') === 'true'
	};
};

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString();
		const password = data.get('password')?.toString();

		if (!username || !password) {
			return { failed: true };
		}

		try {
			// Verify credentials
			const result = await verifyCredentials(username, password);

			if (result.success && result.user) {
				// Create session
				const sessionId = await createSession(result.user);

				// Set session cookie
				cookies.set('session', sessionId, {
					path: '/',
					httpOnly: true,
					sameSite: 'lax',
					maxAge: 60 * 60 * 24 * 30, // 30 days
					secure: false // Set to true in production with HTTPS
				});

				// Redirect to home
				throw redirect(303, '/');
			} else {
				return { failed: true };
			}
		} catch (error) {
			// If it's a redirect, re-throw it
			if (error instanceof Response || (error as any)?.status === 303) {
				throw error;
			}

			console.error('Login error:', error);
			return { failed: true };
		}
	}
} satisfies Actions;
