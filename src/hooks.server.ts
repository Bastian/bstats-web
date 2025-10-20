import type { Handle } from '@sveltejs/kit';
import { getSession } from '$lib/server/auth-simple';

export const handle: Handle = async ({ event, resolve }) => {
	// Get session ID from cookie
	const sessionId = event.cookies.get('session');

	// Load user from session if it exists
	if (sessionId) {
		try {
			const user = await getSession(sessionId);
			if (user) {
				event.locals.user = user;
				event.locals.loggedIn = true;
			} else {
				event.locals.user = null;
				event.locals.loggedIn = false;
			}
		} catch (error) {
			console.error('Session load error:', error);
			event.locals.user = null;
			event.locals.loggedIn = false;
		}
	} else {
		event.locals.user = null;
		event.locals.loggedIn = false;
	}

	const response = await resolve(event);
	return response;
};
