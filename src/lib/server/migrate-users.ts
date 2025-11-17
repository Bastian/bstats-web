/**
 * User migration script
 *
 * Migrates users from Redis to PostgreSQL/Better Auth
 * Preserves usernames, passwords (bcrypt hashes), and admin roles
 *
 * TODO Remove once all users have been migrated
 */
import { Pool } from 'pg';
import { randomUUID } from 'crypto';
import * as databaseManager from './databaseManager.js';
import { env } from '$env/dynamic/private';

const BETTER_AUTH_DATABASE_URL = env.BETTER_AUTH_DATABASE_URL;

if (!BETTER_AUTH_DATABASE_URL) {
    console.error('BETTER_AUTH_DATABASE_URL environment variable is not set.');
    process.exit(1);
}

const pool = new Pool({
    connectionString: BETTER_AUTH_DATABASE_URL
});

export async function migrateUsers() {
    const redis = databaseManager.getRedisCluster();
    const pgClient = await pool.connect();

    try {
        console.log('🔄 Starting user migration from Redis to PostgreSQL...');

        // Get all user keys from Redis Cluster
        // For Redis Cluster, we need to scan all nodes
        let keys: string[] = [];

        if ('nodes' in redis && typeof redis.nodes === 'function') {
            // Redis Cluster - scan all nodes
            const nodes = redis.nodes('master');
            for (const node of nodes) {
                let cursor = '0';
                do {
                    const result = await node.scan(cursor, 'MATCH', 'users:*', 'COUNT', '100');
                    cursor = result[0];
                    keys.push(...result[1]);
                } while (cursor !== '0');
            }
        } else {
            // Single Redis instance - use keys
            keys = await redis.keys('users:*');
        }

        console.log(`   Found ${keys.length} users in Redis`);

        let migrated = 0;
        let skipped = 0;
        let errors = 0;

        for (const key of keys) {
            try {
                // Get user data from Redis
                const userData = await redis.hmget(key, 'name', 'password', 'admin');
                const username = userData[0];
                const passwordHash = userData[1];
                const isAdmin = userData[2] !== null;

                if (!username || !passwordHash) {
                    console.warn(`   ⚠️  Skipping ${key}: missing name or password`);
                    skipped++;
                    continue;
                }

                // Check if user already exists in PostgreSQL
                const existingUser = await pgClient.query(
                    'SELECT id FROM "user" WHERE username = $1',
                    [username.toLowerCase()]
                );

                if (existingUser.rows.length > 0) {
                    console.log(`   ⏭️  Skipping ${username}: already exists in PostgreSQL`);
                    skipped++;
                    continue;
                }

                // Generate UUID for user
                const userId = randomUUID();
                const now = new Date();

                // Sanitize username for email - remove/replace invalid characters
                // Email local parts can contain: letters, numbers, dots, hyphens, underscores
                const sanitizedUsername = username
                    .toLowerCase()
                    .replace(/[^a-z0-9._-]/g, '-') // Replace invalid chars with hyphen
                    .replace(/^[.-]+|[.-]+$/g, '') // Remove leading/trailing dots or hyphens
                    .replace(/\.{2,}/g, '.') // Replace multiple dots with single dot
                    .substring(0, 64); // Max length for email local part

                // Create fake email for legacy accounts
                const fakeEmail = `${sanitizedUsername}@legacy-account.bstats.org`;

                // Insert user into PostgreSQL
                await pgClient.query(
                    `INSERT INTO "user" (id, username, "displayUsername", name, email, "emailVerified", role, "createdAt", "updatedAt", "twoFactorEnabled", banned)
					 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                    [
                        userId,
                        username.toLowerCase(), // username (lowercase for login)
                        username, // displayUsername (preserve original case)
                        username, // name field
                        fakeEmail, // fake email for legacy accounts
                        true, // emailVerified
                        isAdmin ? 'admin' : 'user', // role
                        now, // createdAt
                        now, // updatedAt
                        false, // twoFactorEnabled
                        false // banned
                    ]
                );

                // Insert account with password hash
                // Better Auth stores passwords in the account table
                await pgClient.query(
                    `INSERT INTO "account" (id, "userId", "accountId", "providerId", password, "createdAt", "updatedAt")
					 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [
                        randomUUID(),
                        userId,
                        username.toLowerCase(), // accountId
                        'credential', // providerId (for username/password auth)
                        passwordHash, // bcrypt hash from Redis
                        now,
                        now
                    ]
                );

                console.log(`   ✅ Migrated: ${username}${isAdmin ? ' (admin)' : ''}`);
                migrated++;
            } catch (error) {
                console.error(`   ❌ Error migrating ${key}:`, error);
                errors++;
            }
        }

        console.log('\n📊 Migration Summary:');
        console.log(`   ✅ Successfully migrated: ${migrated}`);
        console.log(`   ⏭️  Skipped (already exist): ${skipped}`);
        console.log(`   ❌ Errors: ${errors}`);
        console.log(`\n✨ Migration complete!`);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        pgClient.release();
        await pool.end();
    }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    migrateUsers()
        .then(() => {
            console.log('\n✅ All users migrated successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Migration failed:', error);
            process.exit(1);
        });
}
