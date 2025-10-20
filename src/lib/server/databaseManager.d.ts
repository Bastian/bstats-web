declare module '$lib/server/databaseManager.js' {
	import type { Redis, Cluster } from 'ioredis';
	export function getRedisCluster(): Redis | Cluster;
}
