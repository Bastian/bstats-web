import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends('app:session');
	// If already logged in, redirect to home
	if (locals.session) {
		throw redirect(303, '/');
	}
};
