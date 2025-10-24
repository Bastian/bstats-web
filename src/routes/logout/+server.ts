import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { auth } from '$lib/auth';

export const GET: RequestHandler = async ({ request }) => {
	// Sign out with Better Auth
	await auth.api.signOut({
		headers: request.headers
	});

	// Redirect to home
	throw redirect(303, '/');
};
