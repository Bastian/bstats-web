import { env } from '$env/dynamic/private';
import type { ClusterNode, RedisOptions } from 'ioredis';

interface Config {
    redis: ClusterNode[] | RedisOptions;
}

function parseRedisConfig(): ClusterNode[] | RedisOptions {
    // Check for cluster configuration first
    if (env.REDIS_CLUSTER) {
        const nodes = env.REDIS_CLUSTER.split(',').map((node) => {
            const [host, port] = node.trim().split(':');
            return {
                host: host || '127.0.0.1',
                port: parseInt(port || '6379', 10)
            };
        });
        return nodes;
    }

    // Fall back to single instance
    const redisConfig: RedisOptions = {
        host: env.REDIS_HOST || '127.0.0.1',
        port: parseInt(env.REDIS_PORT || '6379', 10)
    };

    // Add optional configuration if provided
    if (env.REDIS_PASSWORD) {
        redisConfig.password = env.REDIS_PASSWORD;
    }
    if (env.REDIS_DB) {
        redisConfig.db = parseInt(env.REDIS_DB, 10);
    }

    return redisConfig;
}

const config: Config = {
    redis: parseRedisConfig()
};

export default config;
