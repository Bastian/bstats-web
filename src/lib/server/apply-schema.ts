/**
 * Apply Better Auth database schema
 * Runs automatically on server startup
 */
import { Pool } from 'pg';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

let schemaApplied = false;

export async function ensureSchema() {
	// Only apply schema once per server instance
	if (schemaApplied) {
		return;
	}

	const pool = new Pool({
		connectionString:
			process.env.DATABASE_URL || 'postgresql://bstats:bstats@localhost:5432/bstats_auth'
	});

	const client = await pool.connect();
	try {
		// Check if tables already exist
		const result = await client.query(`
			SELECT EXISTS (
				SELECT FROM information_schema.tables
				WHERE table_schema = 'public'
				AND table_name = 'user'
			);
		`);

		if (result.rows[0].exists) {
			console.log('✅ Better Auth schema already exists');
			schemaApplied = true;
			return;
		}

		console.log('📦 Applying Better Auth schema...');

		// Find the latest migration file
		const migrationsDir = join(process.cwd(), 'better-auth_migrations');

		if (!existsSync(migrationsDir)) {
			throw new Error('Migration directory not found. Run: npx @better-auth/cli generate');
		}

		const files = readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort().reverse();

		if (files.length === 0) {
			throw new Error('No migration files found. Run: npx @better-auth/cli generate');
		}

		const latestMigration = files[0];
		const sql = readFileSync(join(migrationsDir, latestMigration), 'utf-8');

		console.log(`   Applying migration: ${latestMigration}`);
		await client.query(sql);

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
