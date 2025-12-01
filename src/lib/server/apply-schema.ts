/**
 * Apply Better Auth database schema
 * Runs automatically on server startup
 */
import { Pool } from 'pg';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { env } from '$env/dynamic/private';

const BETTER_AUTH_DATABASE_URL = env.BETTER_AUTH_DATABASE_URL;

if (!BETTER_AUTH_DATABASE_URL) {
    console.error('BETTER_AUTH_DATABASE_URL environment variable is not set.');
    process.exit(1);
}

let schemaApplied = false;

export async function ensureSchema() {
    // Only apply schema once per server instance
    if (schemaApplied) {
        return;
    }

    const pool = new Pool({
        connectionString: BETTER_AUTH_DATABASE_URL
    });

    const client = await pool.connect();
    try {
        // Create migrations tracking table if it doesn't exist
        await client.query(`
            CREATE TABLE IF NOT EXISTS _better_auth_migrations (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                applied_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Find migration files
        const migrationsDir = join(process.cwd(), 'better-auth_migrations');

        if (!existsSync(migrationsDir)) {
            throw new Error('Migration directory not found. Run: npx @better-auth/cli generate');
        }

        const files = readdirSync(migrationsDir)
            .filter((f) => f.endsWith('.sql'))
            .sort(); // Sort chronologically (oldest first)

        if (files.length === 0) {
            throw new Error('No migration files found. Run: npx @better-auth/cli generate');
        }

        // Get already applied migrations
        const appliedResult = await client.query('SELECT name FROM _better_auth_migrations');
        const appliedMigrations = new Set(appliedResult.rows.map((r) => r.name));

        // Apply pending migrations
        const pendingMigrations = files.filter((f) => !appliedMigrations.has(f));

        if (pendingMigrations.length === 0) {
            console.log('✅ Better Auth schema is up to date');
            schemaApplied = true;
            return;
        }

        console.log(`📦 Applying ${pendingMigrations.length} migration(s)...`);

        for (const migration of pendingMigrations) {
            const sql = readFileSync(join(migrationsDir, migration), 'utf-8');
            console.log(`   Applying: ${migration}`);

            await client.query('BEGIN');
            try {
                await client.query(sql);
                await client.query('INSERT INTO _better_auth_migrations (name) VALUES ($1)', [
                    migration
                ]);
                await client.query('COMMIT');
            } catch (error) {
                await client.query('ROLLBACK');
                throw error;
            }
        }

        console.log('✅ Better Auth schema applied successfully');
        schemaApplied = true;
    } catch (error) {
        console.error('❌ Error applying schema:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}
