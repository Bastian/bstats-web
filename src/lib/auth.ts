import { betterAuth } from 'better-auth';
import { username, twoFactor, haveIBeenPwned, captcha } from 'better-auth/plugins';
import { Pool } from 'pg';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import bcrypt from 'bcryptjs';

import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

const pool = new Pool({
	connectionString:
		process.env.DATABASE_URL || 'postgresql://bstats:bstats@localhost:5432/bstats_auth'
});

const BETTER_AUTH_SECRET = env.BETTER_AUTH_SECRET;

if (!BETTER_AUTH_SECRET) {
	console.error('BETTER_AUTH_SECRET environment variable is not set.');
	process.exit(1);
}

if (!env.HCAPTCHA_SECRET_KEY) {
	console.error('HCAPTCHA_SECRET_KEY environment variable is not set.');
	process.exit(1);
}

if (!publicEnv.PUBLIC_HCAPTCHA_SITE_KEY) {
	console.error('PUBLIC_HCAPTCHA_SITE_KEY environment variable is not set.');
	process.exit(1);
}

export const auth = betterAuth({
	database: pool,
	appName: 'bStats',
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		autoSignIn: true,
		minPasswordLength: 8,
		password: {
			// Old passwords are bcrypt hashed, so we need to use bcrypt here
			hash: async (password: string) => bcrypt.hash(password, 12),
			verify: async ({ hash, password }) => bcrypt.compare(password, hash)
		}
	},
	user: {
		additionalFields: {
			admin: {
				type: 'boolean',
				required: false,
				defaultValue: false,
				input: false // Don't allow users to set their own admin status
			}
		}
	},
	secret: BETTER_AUTH_SECRET,
	plugins: [
		// Username plugin allows login with username instead of email
		// Needed for maintaining compatibility with old username-only system
		username(),
		haveIBeenPwned({
			customPasswordCompromisedMessage:
				'Password has been found in a data breach. Choose another one.'
		}),
		twoFactor({ issuer: 'bStats' }),
		sveltekitCookies(getRequestEvent),
		captcha({
			provider: 'hcaptcha',
			secretKey: env.HCAPTCHA_SECRET_KEY,
			siteKey: publicEnv.PUBLIC_HCAPTCHA_SITE_KEY,
			endpoints: ['/sign-up/email', '/forget-password']
		})
	],
	/* TODO Enable
	emailVerification: {
		sendVerificationEmail: async (data) => {
			// TODO Style email using MJML
			await sendEmail({
				to: data.user.email,
				subject: 'Verify your email address',
				text: `Click the link to verify your email: ${data.url}`
			});
		},
		autoSignInAfterVerification: true,
		sendOnSignUp: true
	},
	*/
	advanced: {
		useSecureCookies: true
	}
});
