import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { changePassword } from '$lib/server/auth-simple';

export const load: PageServerLoad = async ({ locals }) => {
	// Require authentication
	if (!locals.loggedIn || !locals.user) {
		throw redirect(303, '/login');
	}

	return {
		user: locals.user
	};
};

export const actions = {
	default: async ({ request, locals }) => {
		// Check authentication
		if (!locals.loggedIn || !locals.user) {
			throw redirect(303, '/login');
		}

		const data = await request.formData();
		const currentPassword = data.get('currentPassword')?.toString();
		const newPassword = data.get('newPassword')?.toString();
		const confirmPassword = data.get('confirmPassword')?.toString();

		// Validate inputs
		if (!currentPassword || !newPassword || !confirmPassword) {
			return fail(400, { error: 'All fields are required' });
		}

		if (newPassword.length < 6) {
			return fail(400, { error: 'New password must be at least 6 characters long' });
		}

		if (newPassword !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match' });
		}

		// Change password
		const result = await changePassword(locals.user.username, currentPassword, newPassword);

		if (!result.success) {
			return fail(400, { error: result.error || 'Failed to change password' });
		}

		return { success: 'Password changed successfully!' };
	}
} satisfies Actions;
