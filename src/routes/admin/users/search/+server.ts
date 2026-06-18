import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAuthDbPool } from '$lib/server/auth-db.js';

const MAX_LIMIT = 100;

/**
 * Case-insensitive admin user search.
 *
 * Better Auth's admin plugin only supports a case-sensitive `contains` (plain
 * `LIKE`) search (see https://github.com/better-auth/better-auth/issues/3913#issuecomment-3176078758).
 *
 * This searches the display name
 * fields (`name`, `username`, `displayUsername`) with `ILIKE` and returns the
 * same `{ users, total }` shape as `authClient.admin.listUsers`.
 */
export const GET: RequestHandler = async ({ locals, url }) => {
    if (!locals.session || !locals.user) {
        return error(401, 'Not authenticated');
    }
    if (locals.user.role !== 'admin') {
        return error(403, 'You do not have permission to access this resource.');
    }

    const query = url.searchParams.get('q')?.trim() ?? '';
    if (!query) {
        return json({ users: [], total: 0 });
    }

    const limitParam = Number(url.searchParams.get('limit') ?? '15');
    const limit =
        Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, MAX_LIMIT) : 15;

    const offsetParam = Number(url.searchParams.get('offset') ?? '0');
    const offset = Number.isFinite(offsetParam) && offsetParam >= 0 ? offsetParam : 0;

    // Escape LIKE/ILIKE wildcards so user input is matched literally.
    const escaped = query.replace(/[\\%_]/g, (char) => `\\${char}`);
    const pattern = `%${escaped}%`;

    const where = '"name" ILIKE $1 OR "username" ILIKE $1 OR "displayUsername" ILIKE $1';

    const pool = getAuthDbPool();

    const [rows, count] = await Promise.all([
        pool.query(
            `SELECT "id", "name", "email", "username", "displayUsername", "role", "banned", "banReason", "banExpires"
             FROM "user"
             WHERE ${where}
             ORDER BY "name" ASC
             LIMIT $2 OFFSET $3`,
            [pattern, limit, offset]
        ),
        pool.query(`SELECT COUNT(*)::int AS total FROM "user" WHERE ${where}`, [pattern])
    ]);

    return json({ users: rows.rows, total: count.rows[0]?.total ?? 0 });
};
