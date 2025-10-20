import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { createUser, createSession } from '$lib/server/auth-simple';
// @ts-ignore
import config from '$lib/server/config.js';

export const load: PageServerLoad = async ({ locals }) => {
	// If already logged in, redirect to home
	if (locals.loggedIn) {
		throw redirect(303, '/');
	}

	return {
		publicKey: config.recaptcha.publicKey
	};
};

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString();
		const password = data.get('password')?.toString();
		const recaptchaResponse = data.get('g-recaptcha-response')?.toString();

		// Validate inputs
		if (!username || username.length === 0 || username.length > 32) {
			return { failed: true };
		}

		if (!/^[-_a-zA-Z0-9]+(\s[-_a-zA-Z0-9]+)*$/.test(username)) {
			return { failed: true };
		}

		if (!password) {
			return { failed: true };
		}

		// Validate reCAPTCHA
		if (!recaptchaResponse) {
			return { wrongCaptcha: true };
		}

		try {
			// Verify reCAPTCHA
			const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${config.recaptcha.secretKey}&response=${recaptchaResponse}`;
			const verifyResponse = await fetch(verificationUrl, { method: 'POST' });
			const verifyResult = await verifyResponse.json();

			if (!verifyResult.success) {
				return { wrongCaptcha: true };
			}

			// Create user
			const userCreated = await createUser(username, password);

			if (!userCreated) {
				return { failed: true }; // User already exists
			}

			// Create session for the new user
			const sessionId = await createSession({ username, admin: false });

			// Set session cookie
			cookies.set('session', sessionId, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 30, // 30 days
				secure: false // Set to true in production with HTTPS
			});

			// Registration successful - redirect to home
			throw redirect(303, '/');
		} catch (error) {
			// If it's a redirect, re-throw it
			if (error instanceof Response || (error as any)?.status === 303) {
				throw error;
			}

			console.error('Registration error:', error);
			return { failed: true };
		}
	}
} satisfies Actions;
