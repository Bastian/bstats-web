import type { PageServerLoad, Actions } from './$types';
import { fail, type RequestEvent } from '@sveltejs/kit';
import * as databaseManager from '$lib/server/databaseManager.js';
import crypto from 'crypto';

const RESET_TOKEN_EXPIRY_DAYS = 7;
const RESET_TOKEN_EXPIRY_MS = RESET_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const RESET_TOKEN_EXPIRY_SECONDS = RESET_TOKEN_EXPIRY_DAYS * 24 * 60 * 60; // 7 days in seconds (for Redis TTL)

// Generate secure random token
function generateResetToken(): string {
	return crypto.randomBytes(32).toString('hex');
}

export const load: PageServerLoad = async ({ locals }) => {
	const { loggedIn, user } = locals;
	const isAdmin = loggedIn && user && user.admin;

	return {
		loggedIn,
		user,
		isAdmin
	};
};

export const actions = {
	generateResetLink: async ({ request, locals, url }: RequestEvent) => {
		// Check if user is admin
		if (!locals.loggedIn || !locals.user || !locals.user.admin) {
			return fail(403, {
				success: false,
				error: 'Access denied. Admin privileges required.'
			});
		}

		const data = await request.formData();
		const username = data.get('username')?.toString();

		if (!username) {
			return fail(400, {
				success: false,
				error: 'Username is required'
			});
		}

		const userKey = `users:${username.toLowerCase()}`;
		const redisCluster = databaseManager.getRedisCluster();

		// Check if user exists
		try {
			const exists = await new Promise<number>((resolve, reject) => {
				redisCluster.hexists(userKey, 'name', (err: Error | null, result: number) => {
					if (err) reject(err);
					else resolve(result);
				});
			});

			if (!exists) {
				return fail(404, {
					success: false,
					error: 'User not found'
				});
			}

			// Generate reset token
			const resetToken = generateResetToken();
			const expiry = Date.now() + RESET_TOKEN_EXPIRY_MS;

			// Store reset token in Redis
			const tokenKey = `password_reset:${resetToken}`;
			await new Promise<void>((resolve, reject) => {
				redisCluster.hmset(
					tokenKey,
					{
						username: username.toLowerCase(),
						expiry: expiry.toString(),
						created_by: locals.user!.username,
						created_at: Date.now().toString()
					},
					(err: Error | null) => {
						if (err) reject(err);
						else resolve();
					}
				);
			});

			// Set expiration on the token key
			await new Promise<void>((resolve, reject) => {
				redisCluster.expire(tokenKey, RESET_TOKEN_EXPIRY_SECONDS, (err: Error | null) => {
					if (err) reject(err);
					else resolve();
				});
			});

			const resetLink = `${url.protocol}//${url.host}/reset-password?token=${resetToken}`;

			return {
				success: true,
				resetLink,
				token: resetToken,
				expiresIn: `${RESET_TOKEN_EXPIRY_DAYS} days`
			};
		} catch (error) {
			console.error('Error generating reset link:', error);
			return fail(500, {
				success: false,
				error: 'Database error occurred'
			});
		}
	}
} satisfies Actions;
