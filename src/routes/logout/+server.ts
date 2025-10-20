import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { destroySession } from '$lib/server/auth-simple';

export const GET: RequestHandler = async ({ cookies }) => {
	// Get session ID and destroy it
	const sessionId = cookies.get('session');
	if (sessionId) {
		await destroySession(sessionId);
	}

	// Clear session cookie
	cookies.delete('session', { path: '/' });

	// Redirect to home
	throw redirect(303, '/');
};
