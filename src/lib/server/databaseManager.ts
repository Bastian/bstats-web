import config from './config.js';
import Redis, { Cluster } from 'ioredis';

let cluster: Redis | Cluster | null = null;

export function getRedisCluster(): Redis | Cluster {
    if (cluster === null) {
        if (Array.isArray(config.redis)) {
            cluster = new Cluster(config.redis);
        } else {
            cluster = new Redis(config.redis);
        }
    }
    return cluster;
}
