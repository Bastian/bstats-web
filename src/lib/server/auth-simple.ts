import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import * as databaseManager from './databaseManager.js';

const saltRounds = 10;

// Session storage in Redis (30 day TTL)
const SESSION_TTL = 60 * 60 * 24 * 30; // 30 days in seconds

/**
 * Create a new user account
 */
export async function createUser(username: string, password: string): Promise<boolean> {
	const redis = databaseManager.getRedisCluster();
	const userKey = `users:${username.toLowerCase()}`;

	// Check if user already exists
	const exists = await redis.hexists(userKey, 'name');
	if (exists === 1) {
		return false; // User already exists
	}

	// Hash password
	const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));

	// Create user
	await redis.hmset(userKey, { name: username, password: hash });

	return true;
}

/**
 * Verify user credentials
 */
export async function verifyCredentials(
	username: string,
	password: string
): Promise<{ success: boolean; user?: { username: string; admin: boolean } }> {
	const redis = databaseManager.getRedisCluster();
	const userKey = `users:${username.toLowerCase()}`;

	// Get user data
	const userData = await redis.hmget(userKey, 'name', 'password', 'admin');

	if (!userData[0]) {
		return { success: false }; // User doesn't exist
	}

	// Verify password
	const isValid = bcrypt.compareSync(password, userData[1]);
	if (!isValid) {
		return { success: false }; // Wrong password
	}

	return {
		success: true,
		user: {
			username: userData[0],
			admin: userData[2] !== null
		}
	};
}

/**
 * Create a new session for a user
 */
export async function createSession(user: { username: string; admin: boolean }): Promise<string> {
	const sessionId = randomUUID();
	const redis = databaseManager.getRedisCluster();
	const sessionKey = `sess:${sessionId}`;

	// Store session data in Redis
	const sessionData = {
		user: user.username,
		admin: user.admin ? '1' : '0',
		createdAt: Date.now().toString()
	};

	await redis.hmset(sessionKey, sessionData);
	await redis.expire(sessionKey, SESSION_TTL);

	console.log('Created session:', sessionId, 'for user:', user.username);

	return sessionId;
}

/**
 * Get session data from Redis
 */
export async function getSession(
	sessionId: string
): Promise<{ username: string; admin: boolean } | null> {
	const redis = databaseManager.getRedisCluster();
	const sessionKey = `sess:${sessionId}`;

	const sessionData = await redis.hmget(sessionKey, 'user', 'admin');

	if (!sessionData[0]) {
		return null; // Session doesn't exist
	}

	// Refresh session TTL
	await redis.expire(sessionKey, SESSION_TTL);

	return {
		username: sessionData[0],
		admin: sessionData[1] === '1'
	};
}

/**
 * Destroy a session
 */
export async function destroySession(sessionId: string): Promise<void> {
	const redis = databaseManager.getRedisCluster();
	const sessionKey = `sess:${sessionId}`;
	await redis.del(sessionKey);
}

/**
 * Change user password
 */
export async function changePassword(
	username: string,
	currentPassword: string,
	newPassword: string
): Promise<{ success: boolean; error?: string }> {
	const redis = databaseManager.getRedisCluster();
	const userKey = `users:${username.toLowerCase()}`;

	// Get current user data
	const userData = await redis.hmget(userKey, 'name', 'password');

	if (!userData[0]) {
		return { success: false, error: 'User not found' };
	}

	// Verify current password
	const isValid = bcrypt.compareSync(currentPassword, userData[1]);
	if (!isValid) {
		return { success: false, error: 'Current password is incorrect' };
	}

	// Hash new password
	const newHash = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(saltRounds));

	// Update password
	await redis.hset(userKey, 'password', newHash);

	return { success: true };
}
