import * as databaseManager from '../databaseManager.js';
import type { Software } from './software.js';

export interface Plugin {
	id: number;
	name: string;
	software: number;
	charts: number[];
	owner: string;
	global: boolean;
}

type PluginField = keyof Omit<Plugin, 'id'>;

const PLUGIN_FIELDS: PluginField[] = ['name', 'software', 'charts', 'owner', 'global'];

export async function getPluginById(id: number): Promise<Plugin | null> {
	const res = await databaseManager.getRedisCluster().hmget(`plugins:${id}`, ...PLUGIN_FIELDS);

	if (res === null || res.every((v) => v === null)) {
		return null;
	}

	const result: Partial<Plugin> = { id };

	for (let i = 0; i < PLUGIN_FIELDS.length; i++) {
		const field = PLUGIN_FIELDS[i];
		const value = res[i];

		switch (field) {
			case 'charts':
				result[field] = value ? JSON.parse(value) : [];
				break;
			case 'global':
				result[field] = value !== null;
				break;
			case 'software':
				result[field] = value ? parseInt(value) : 0;
				break;
			default:
				result[field] = value ?? undefined;
				break;
		}
	}

	return result as Plugin;
}

export async function getPluginBySoftwareUrlAndName(
	softwareUrl: string,
	pluginName: string
): Promise<Plugin | null> {
	const normalizedUrl = softwareUrl.toLowerCase();
	const normalizedName = pluginName.toLowerCase();

	const pluginId = await databaseManager
		.getRedisCluster()
		.get(`plugins.index.id.url+name:${normalizedUrl}.${normalizedName}`);

	if (pluginId === null) {
		return null;
	}

	return getPluginById(parseInt(pluginId));
}

export async function getAllPluginIds(): Promise<number[]> {
	const res = await databaseManager.getRedisCluster().smembers('plugins.ids');
	return res.map((id) => parseInt(id));
}

export async function getPluginsOfUser(
	username: string
): Promise<Array<Plugin>> {
	const normalizedUsername = username.toLowerCase();
	const pluginIds = await databaseManager
		.getRedisCluster()
		.smembers(`users.index.plugins.username:${normalizedUsername}`);

	const plugins = await Promise.all(pluginIds.map((id) => getPluginById(parseInt(id))));

	return plugins.filter((plugin): plugin is Plugin => plugin !== null);
}

export async function addPlugin(
	plugin: Pick<Plugin, 'name' | 'software' | 'charts' | 'owner'>,
	software: Software
): Promise<number> {
	const pluginId = await databaseManager.getRedisCluster().incr('plugins.id-increment');

	const { name, software: softwareId, charts, owner } = plugin;

	if (software.id !== softwareId) {
		throw new Error('Software ID mismatch when adding plugin');
	}

	await Promise.all([
		databaseManager.getRedisCluster().sadd('plugins.ids', pluginId),
		databaseManager
			.getRedisCluster()
			.set(
				`plugins.index.id.url+name:${software.url.toLowerCase()}.${plugin.name.toLowerCase()}`,
				pluginId
			),
		databaseManager
			.getRedisCluster()
			.sadd(`users.index.plugins.username:${plugin.owner.toLowerCase()}`, pluginId),
		databaseManager.getRedisCluster().hmset(`plugins:${pluginId}`, {
			name,
			software: softwareId,
			charts: JSON.stringify(charts),
			owner
		})
	]);

	return pluginId;
}

export async function updatePluginCharts(pluginId: number, charts: number[]): Promise<void> {
	await databaseManager
		.getRedisCluster()
		.hset(`plugins:${pluginId}`, 'charts', JSON.stringify(charts));
}

export async function deletePlugin(pluginId: number): Promise<void> {
	await databaseManager.getRedisCluster().del(`plugins:${pluginId}`);
}

export async function deletePluginIndex(softwareUrl: string, pluginName: string): Promise<void> {
	const normalizedUrl = softwareUrl.toLowerCase();
	const normalizedName = pluginName.toLowerCase();
	await databaseManager
		.getRedisCluster()
		.del(`plugins.index.id.url+name:${normalizedUrl}.${normalizedName}`);
}

export async function removePluginFromPluginIds(pluginId: number): Promise<void> {
	await databaseManager.getRedisCluster().srem('plugins.ids', pluginId);
}

export async function removePluginFromUser(username: string, pluginId: number): Promise<void> {
	const normalizedUsername = username.toLowerCase();
	await databaseManager
		.getRedisCluster()
		.srem(`users.index.plugins.username:${normalizedUsername}`, pluginId);
}

export async function addPluginToUser(username: string, pluginId: number): Promise<void> {
	const normalizedUsername = username.toLowerCase();
	await databaseManager
		.getRedisCluster()
		.sadd(`users.index.plugins.username:${normalizedUsername}`, pluginId);
}

export async function updatePluginOwner(pluginId: number, newOwner: string): Promise<void> {
	await databaseManager.getRedisCluster().hset(`plugins:${pluginId}`, 'owner', newOwner);
}

export async function transferPluginOwnership(
	pluginId: number,
	oldOwner: string,
	newOwner: string
): Promise<void> {
	await Promise.all([
		removePluginFromUser(oldOwner, pluginId),
		addPluginToUser(newOwner, pluginId),
		updatePluginOwner(pluginId, newOwner)
	]);
}
