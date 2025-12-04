import { APIError, betterAuth } from 'better-auth';
import {
    username,
    twoFactor,
    haveIBeenPwned,
    captcha,
    admin,
    createAuthMiddleware
} from 'better-auth/plugins';
import { Pool } from 'pg';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import bcrypt from 'bcryptjs';
import { building } from '$app/environment';

import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export type AppAuth = ReturnType<typeof createAuth>;

let _auth: AppAuth | null = null;

export function getAuth(): AppAuth {
    if (building) {
        // Should never be called during Vite/SvelteKit build
        throw new Error('getAuth() was called while building');
    }
    if (!_auth) {
        _auth = createAuth();
    }
    return _auth;
}

function createAuth() {
    if (!env.BETTER_AUTH_DATABASE_URL) throw new Error('BETTER_AUTH_DATABASE_URL is not set');
    if (!env.BETTER_AUTH_SECRET) throw new Error('BETTER_AUTH_SECRET is not set');
    if (!env.HCAPTCHA_SECRET_KEY) throw new Error('HCAPTCHA_SECRET_KEY is not set');
    if (!publicEnv.PUBLIC_HCAPTCHA_SITE_KEY) throw new Error('PUBLIC_HCAPTCHA_SITE_KEY is not set');

    const pool = new Pool({ connectionString: env.BETTER_AUTH_DATABASE_URL });

    return betterAuth({
        database: pool,
        appName: 'bStats',
        baseURL: publicEnv.PUBLIC_BASE_URL,
        trustedOrigins: [publicEnv.PUBLIC_BASE_URL],
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
            deleteUser: {
                // TODO Enable once we have hooks to cleanup user data in Redis
                enabled: false
            },
            additionalFields: {
                tosAccepted: {
                    type: 'number',
                    input: false,
                    required: false,
                    bigint: true
                }
            }
        },
        secret: env.BETTER_AUTH_SECRET,
        plugins: [
            // Username plugin allows login with username instead of email
            // Needed for maintaining compatibility with old username-only system
            username(),
            admin(),
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
        },
        hooks: {
            before: createAuthMiddleware(async (ctx) => {
                if (ctx.path === '/update-user' && typeof ctx.body?.username !== 'undefined') {
                    // TODO Allow username changes in the future
                    throw new APIError('FORBIDDEN', { message: 'Username changes are disabled.' });
                }
            })
        },
        databaseHooks: {
            user: {
                create: {
                    before: async (user) => {
                        // Set tosAccepted to current timestamp on account creation
                        return {
                            data: {
                                ...user,
                                tosAccepted: Date.now()
                            }
                        };
                    }
                },
                update: {
                    before: async (data) => {
                        if ('username' in data) {
                            throw new APIError('FORBIDDEN', {
                                message: 'Username changes are disabled.'
                            });
                        }
                        return { data };
                    }
                }
            }
        }
    });
}
