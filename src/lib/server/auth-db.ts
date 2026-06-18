import { Pool } from 'pg';
import { building } from '$app/environment';
import { env } from '$env/dynamic/private';

let _pool: Pool | null = null;

/**
 * Lazily created connection pool for the Better Auth Postgres database.
 *
 * Shared between the Better Auth instance (see `$lib/auth`) and the few places
 * that need to run queries Better Auth's ORM can't express
 * (https://github.com/better-auth/better-auth/issues/3913#issuecomment-3176078758)
 */
export function getAuthDbPool(): Pool {
    if (building) {
        // Should never be called during Vite/SvelteKit build
        throw new Error('getAuthDbPool() was called while building');
    }
    if (!_pool) {
        if (!env.BETTER_AUTH_DATABASE_URL) throw new Error('BETTER_AUTH_DATABASE_URL is not set');
        _pool = new Pool({ connectionString: env.BETTER_AUTH_DATABASE_URL });
    }
    return _pool;
}
