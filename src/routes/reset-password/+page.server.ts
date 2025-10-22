import type { PageServerLoad, Actions } from './$types';
import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import * as databaseManager from '$lib/server/databaseManager.js';
import bcrypt from 'bcryptjs';

const saltRounds = 10;

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');
	const success = url.searchParams.get('success');

	// If we have a success param, show success message
	if (success === 'true') {
		return {
			error: null,
			success: 'Password reset successfully! You can now log in with your new password.',
			token: null,
			username: null
		};
	}

	if (!token) {
		return {
			error: 'Invalid or missing reset token.',
			success: null,
			token: null,
			username: null
		};
	}

	const tokenKey = `password_reset:${token}`;
	const redisCluster = databaseManager.getRedisCluster();

	// Check if token exists and is valid
	try {
		const result = await redisCluster.hmget(tokenKey, 'username', 'expiry');

		if (!result[0]) {
			return {
				error: 'Invalid or expired reset token.',
				success: null,
				token: null,
				username: null
			};
		}

		const username = result[0];
		const expiry = parseInt(result[1] || '0');

		if (Date.now() > expiry) {
			// Token expired, clean it up
			await redisCluster.del(tokenKey);
			return {
				error: 'Reset token has expired. Please request a new one.',
				success: null,
				token: null,
				username: null
			};
		}

		// Token is valid, show reset form
		return {
			error: null,
			success: null,
			token,
			username
		};
	} catch (error) {
		console.error('Redis error:', error);
		return {
			error: 'Database error occurred.',
			success: null,
			token: null,
			username: null
		};
	}
};

export const actions = {
	default: async ({ request }: RequestEvent) => {
		const data = await request.formData();
		const token = data.get('token')?.toString();
		const newPassword = data.get('newPassword')?.toString();
		const confirmPassword = data.get('confirmPassword')?.toString();

		if (!token || !newPassword || !confirmPassword) {
			return fail(400, {
				error: 'All fields are required.',
				success: null,
				token: token || null
			});
		}

		if (newPassword !== confirmPassword) {
			return fail(400, {
				error: 'Passwords do not match.',
				success: null,
				token
			});
		}

		if (newPassword.length < 6) {
			return fail(400, {
				error: 'Password must be at least 6 characters long.',
				success: null,
				token
			});
		}

		const tokenKey = `password_reset:${token}`;
		const redisCluster = databaseManager.getRedisCluster();

		// Verify token
		try {
			const result = await redisCluster.hmget(tokenKey, 'username', 'expiry');

			if (!result[0]) {
				return fail(400, {
					error: 'Invalid or expired reset token.',
					success: null,
					token: null
				});
			}

			const username = result[0];
			const expiry = parseInt(result[1] || '0');

			if (Date.now() > expiry) {
				// Token expired, clean it up
				await redisCluster.del(tokenKey);
				return fail(400, {
					error: 'Reset token has expired. Please request a new one.',
					success: null,
					token: null
				});
			}

			// Hash new password
			const newHash = await bcrypt.hash(newPassword, saltRounds);

			// Update password in Redis
			const userKey = `users:${username}`;
			await redisCluster.hset(userKey, 'password', newHash);

			// Delete the used token
			await redisCluster.del(tokenKey);
		} catch (error) {
			console.error('Error resetting password:', error);
			return fail(500, {
				error: 'Failed to update password. Please try again.',
				success: null,
				token
			});
		}

		// Redirect to success page (outside of try-catch)
		throw redirect(303, '/reset-password?success=true');
	}
} satisfies Actions;
