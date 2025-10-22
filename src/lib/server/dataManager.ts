import * as databaseManager from './databaseManager.js';
import * as timeUtil from './timeUtil.js';

export interface Software {
	id: number;
	name: string;
	url: string;
	globalPlugin: number;
	metricsClass: string;
	examplePlugin: string;
	maxRequestsPerIp: number;
	defaultCharts: unknown[];
	hideInPluginList: boolean;
}

export interface Plugin {
	id: number;
	name: string;
	software: number;
	charts: number[];
	owner: string;
	global: boolean;
}

export interface Chart {
	uid: number;
	id: string;
	type: string;
	position: number;
	title: string;
	default: boolean;
	data: unknown;
}

export interface DrilldownPieData {
	seriesData: Array<{ name: string; y: number; drilldown: string }>;
	drilldownData: Array<{ name: string; id: string; data: Array<[string, number]> }>;
}

type SoftwareField = keyof Omit<Software, 'id'>;
type PluginField = keyof Omit<Plugin, 'id'>;
type ChartField = keyof Omit<Chart, 'uid'>;

const DEFAULT_SOFTWARE_FIELDS: SoftwareField[] = [
	'name',
	'url',
	'globalPlugin',
	'metricsClass',
	'examplePlugin',
	'maxRequestsPerIp',
	'defaultCharts',
	'hideInPluginList'
];

const DEFAULT_PLUGIN_FIELDS: PluginField[] = ['name', 'software', 'charts', 'owner', 'global'];

const DEFAULT_CHART_FIELDS: ChartField[] = ['id', 'type', 'position', 'title', 'default', 'data'];

export async function getSoftwareById(
	id: number,
	fields: SoftwareField[] = DEFAULT_SOFTWARE_FIELDS
): Promise<Partial<Software>> {
	const res = await databaseManager.getRedisCluster().hmget(`software:${id}`, ...fields);

	const result: Partial<Software> = { id: parseInt(String(id)) };

	for (let i = 0; i < fields.length; i++) {
		const field = fields[i];
		const value = res[i];

		switch (field) {
			case 'defaultCharts':
				result[field] = value ? JSON.parse(value) : null;
				break;
			case 'maxRequestsPerIp':
				result[field] = value ? parseInt(value) : 0;
				break;
			case 'hideInPluginList':
				result[field] = value !== null;
				break;
			default:
				(result as any)[field] = value;
				break;
		}
	}

	return result;
}

export async function getSoftwareByUrl(
	url: string,
	fields: SoftwareField[] = DEFAULT_SOFTWARE_FIELDS
): Promise<Partial<Software> | null> {
	const normalizedUrl = url.toLowerCase();
	const softwareId = await databaseManager
		.getRedisCluster()
		.get(`software.index.id.url:${normalizedUrl}`);

	if (softwareId === null) {
		return null;
	}

	return getSoftwareById(parseInt(softwareId), fields);
}

export async function getPluginById(
	id: number,
	fields: PluginField[] = DEFAULT_PLUGIN_FIELDS
): Promise<Partial<Plugin> | null> {
	const res = await databaseManager.getRedisCluster().hmget(`plugins:${id}`, ...fields);

	if (res === null || res.every((v) => v === null)) {
		return null;
	}

	const result: Partial<Plugin> = { id };

	for (let i = 0; i < fields.length; i++) {
		const field = fields[i];
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
				(result as any)[field] = value;
				break;
		}
	}

	return result;
}

export async function getPluginBySoftwareUrlAndName(
	softwareUrl: string,
	pluginName: string,
	fields: PluginField[] = DEFAULT_PLUGIN_FIELDS
): Promise<Partial<Plugin> | null> {
	const normalizedUrl = softwareUrl.toLowerCase();
	const normalizedName = pluginName.toLowerCase();

	const pluginId = await databaseManager
		.getRedisCluster()
		.get(`plugins.index.id.url+name:${normalizedUrl}.${normalizedName}`);

	if (pluginId === null) {
		return null;
	}

	return getPluginById(parseInt(pluginId), fields);
}

export async function getChartByUid(
	uid: number,
	fields: ChartField[] = DEFAULT_CHART_FIELDS
): Promise<Partial<Chart> | null> {
	const res = await databaseManager.getRedisCluster().hmget(`charts:${uid}`, ...fields);

	if (res === null || res.every((v) => v === null)) {
		return null;
	}

	const result: Partial<Chart> = { uid };

	for (let i = 0; i < fields.length; i++) {
		const field = fields[i];
		const value = res[i];

		switch (field) {
			case 'data':
				result[field] = value ? JSON.parse(value) : null;
				break;
			case 'default':
				result[field] = value !== null;
				break;
			case 'position':
				result[field] = value ? parseInt(value) : 0;
				break;
			default:
				(result as any)[field] = value;
				break;
		}
	}

	return result;
}

export async function getChartByPluginIdAndChartId(
	pluginId: number,
	chartId: string,
	fields: ChartField[] = DEFAULT_CHART_FIELDS
): Promise<Partial<Chart> | null> {
	const chartUid = await databaseManager
		.getRedisCluster()
		.get(`charts.index.uid.pluginId+chartId:${pluginId}.${chartId}`);

	if (chartUid === null) {
		return null;
	}

	return getChartByUid(parseInt(chartUid), fields);
}

export async function getChartUidByPluginIdAndChartId(
	pluginId: number,
	chartId: string
): Promise<number | null> {
	const chartUid = await databaseManager
		.getRedisCluster()
		.get(`charts.index.uid.pluginId+chartId:${pluginId}.${chartId}`);

	return chartUid ? parseInt(chartUid) : null;
}

export async function getAllPluginIds(): Promise<number[]> {
	const res = await databaseManager.getRedisCluster().smembers('plugins.ids');
	return res.map((id) => parseInt(id));
}

export async function getAllSoftwareIds(): Promise<number[]> {
	const res = await databaseManager.getRedisCluster().smembers('software.ids');
	return res.map((id) => parseInt(id));
}

export async function getAllSoftware(
	fields: SoftwareField[] = DEFAULT_SOFTWARE_FIELDS
): Promise<Array<Partial<Software>>> {
	const softwareIds = await getAllSoftwareIds();
	return Promise.all(softwareIds.map((id) => getSoftwareById(id, fields)));
}

export async function getChartsByPluginId(
	pluginId: number,
	fields: ChartField[] = DEFAULT_CHART_FIELDS
): Promise<Array<Partial<Chart>> | null> {
	const plugin = await getPluginById(pluginId, ['charts']);

	if (plugin === null || !plugin.charts) {
		return null;
	}

	const charts = await Promise.all(
		plugin.charts.map((chartUid) => getChartByUid(chartUid, fields))
	);

	return charts.filter((chart): chart is Partial<Chart> => chart !== null);
}

export async function getPluginsOfUser(
	username: string,
	fields: PluginField[] = DEFAULT_PLUGIN_FIELDS
): Promise<Array<Partial<Plugin>>> {
	const normalizedUsername = username.toLowerCase();
	const pluginIds = await databaseManager
		.getRedisCluster()
		.smembers(`users.index.plugins.username:${normalizedUsername}`);

	const plugins = await Promise.all(pluginIds.map((id) => getPluginById(parseInt(id), fields)));

	return plugins.filter((plugin): plugin is Partial<Plugin> => plugin !== null);
}

export async function getLimitedLineChartData(
	chartUid: number,
	line: string,
	amount: number
): Promise<Array<[number, number]>> {
	let startDate =
		timeUtil.tms2000ToDate(timeUtil.dateToTms2000(new Date()) - 1).getTime() -
		1000 * 60 * 30 * amount;

	const datesToFetch: number[] = [];
	for (let i = 0; i < amount; i++) {
		startDate += 1000 * 60 * 30;
		datesToFetch.push(startDate);
	}

	const res = await databaseManager
		.getRedisCluster()
		.hmget(`data:${chartUid}.${line}`, ...datesToFetch.map(String));

	const data: Array<[number, number]> = [];
	for (let i = 0; i < res.length; i++) {
		const value = res[i];
		if (value !== null && !isNaN(parseInt(value))) {
			data.push([datesToFetch[i], parseInt(value)]);
		} else if (value !== 'ignored') {
			data.push([datesToFetch[i], 0]);
		}
	}

	return data;
}

export async function addPlugin(plugin: Omit<Plugin, 'id'>, software: Software): Promise<number> {
	const pluginId = await databaseManager.getRedisCluster().incr('plugins.id-increment');

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
		databaseManager
			.getRedisCluster()
			.hmset(`plugins:${pluginId}`, plugin as unknown as Record<string, string | number>)
	]);

	return pluginId;
}

// ============================================================================
// Chart Management Operations
// ============================================================================

export async function createChart(
	pluginId: number,
	chartData: {
		id: string;
		type: string;
		position: number;
		title: string;
		isDefault?: boolean;
		data: unknown;
	}
): Promise<number> {
	const redis = databaseManager.getRedisCluster();

	// Increment chart UID
	const chartUid = await redis.incr('charts.uid-increment');

	// Create chart data for Redis
	const chartRedis: Record<string, string> = {
		pluginId: pluginId.toString(),
		id: chartData.id,
		type: chartData.type,
		position: chartData.position.toString(),
		title: chartData.title,
		data: JSON.stringify(chartData.data)
	};

	// Add default flag if specified
	if (chartData.isDefault) {
		chartRedis.default = '1';
	}

	// Store chart
	await redis.hmset(`charts:${chartUid}`, chartRedis);

	// Create index for quick lookup
	await redis.set(`charts.index.uid.pluginId+chartId:${pluginId}.${chartData.id}`, chartUid);

	// Add to charts set
	await redis.sadd('charts.uids', chartUid);

	return chartUid;
}

export async function deleteChart(chartUid: number): Promise<void> {
	await databaseManager.getRedisCluster().del(`charts:${chartUid}`);
}

export async function updateChartPosition(chartUid: number, position: number): Promise<void> {
	await databaseManager.getRedisCluster().hset(`charts:${chartUid}`, 'position', position);
}

export async function deleteChartIndex(pluginId: number, chartId: string): Promise<void> {
	await databaseManager
		.getRedisCluster()
		.del(`charts.index.uid.pluginId+chartId:${pluginId}.${chartId}`);
}

export async function removeChartFromUids(chartUid: number): Promise<void> {
	await databaseManager.getRedisCluster().srem('charts.uids', chartUid);
}

export async function deleteChartLineData(chartUid: number): Promise<void> {
	await databaseManager.getRedisCluster().del(`data:${chartUid}.1`);
}

// ============================================================================
// Plugin Management Operations
// ============================================================================

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
