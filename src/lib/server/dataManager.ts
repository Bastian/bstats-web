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

export async function getGlobalPluginBySoftwareUrl(
	url: string,
	fields: PluginField[] = DEFAULT_PLUGIN_FIELDS
): Promise<Partial<Plugin> | null> {
	const software = await getSoftwareByUrl(url, ['globalPlugin']);

	if (software === null || software.globalPlugin === undefined) {
		return null;
	}

	return getPluginById(software.globalPlugin, fields);
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

	const plugins = await Promise.all(
		pluginIds.map((id) => getPluginById(parseInt(id), fields))
	);

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

export async function getFullLineChartData(
	chartUid: number,
	line: string
): Promise<Array<[number, number]>> {
	const res = await databaseManager.getRedisCluster().hgetall(`data:${chartUid}.${line}`);

	const data: Array<[number, number]> = [];
	const maxTimestamp = timeUtil.tms2000ToDate(timeUtil.dateToTms2000(new Date()) - 1).getTime();

	for (const [property, value] of Object.entries(res)) {
		const timestamp = parseInt(property);
		if (timestamp <= maxTimestamp && property !== 'ignored') {
			data.push([timestamp, parseInt(value)]);
		}
	}

	return data;
}

export async function getPieData(chartUid: number): Promise<Array<{ name: string; y: number }>> {
	const tms2000 = timeUtil.dateToTms2000(new Date()) - 1;
	const res = await databaseManager
		.getRedisCluster()
		.zrange(`data:${chartUid}.${tms2000}`, 0, -1, 'WITHSCORES');

	const data: Array<{ name: string; y: number }> = [];
	for (let i = 0; i < res.length; i += 2) {
		data.push({ name: res[i], y: parseInt(res[i + 1]) });
	}

	return data;
}

export async function getDrilldownPieData(chartUid: number): Promise<DrilldownPieData> {
	const tms2000 = timeUtil.dateToTms2000(new Date()) - 1;
	const res = await databaseManager
		.getRedisCluster()
		.zrange(`data:${chartUid}.${tms2000}`, 0, -1, 'WITHSCORES');

	const seriesData: Array<{ name: string; y: number; drilldown: string }> = [];
	const drilldownPromises: Promise<{ name: string; id: string; data: Array<[string, number]> }>[] =
		[];

	for (let i = 0; i < res.length; i += 2) {
		const name = res[i];
		const value = parseInt(res[i + 1]);
		seriesData.push({ name, y: value, drilldown: name });
		drilldownPromises.push(getDrilldownPieDrilldownData(chartUid, name));
	}

	const drilldownData = await Promise.all(drilldownPromises);

	return { seriesData, drilldownData };
}

async function getDrilldownPieDrilldownData(
	chartUid: number,
	name: string
): Promise<{ name: string; id: string; data: Array<[string, number]> }> {
	const tms2000 = timeUtil.dateToTms2000(new Date()) - 1;
	const res = await databaseManager
		.getRedisCluster()
		.zrange(`data:${chartUid}.${tms2000}.${name}`, 0, -1, 'WITHSCORES');

	const data: Array<[string, number]> = [];
	for (let i = 0; i < res.length; i += 2) {
		data.push([res[i], parseInt(res[i + 1])]);
	}

	return { name, id: name, data };
}

export async function getMapData(
	chartUid: number
): Promise<Array<{ code: string; value: number }>> {
	const tms2000 = timeUtil.dateToTms2000(new Date()) - 1;
	const res = await databaseManager
		.getRedisCluster()
		.zrange(`data:${chartUid}.${tms2000}`, 0, -1, 'WITHSCORES');

	const data: Array<{ code: string; value: number }> = [];
	for (let i = 0; i < res.length; i += 2) {
		data.push({ code: res[i], value: parseInt(res[i + 1]) });
	}

	return data;
}

export async function updatePieData(
	chartUid: number,
	tms2000: number,
	valueName: string,
	value: number
): Promise<void> {
	try {
		await databaseManager.getRedisCluster().zincrby(`data:${chartUid}.${tms2000}`, value, valueName);
		await databaseManager.getRedisCluster().expire(`data:${chartUid}.${tms2000}`, 60 * 61);
	} catch (err) {
		console.error('Error updating pie data:', err);
	}
}

export async function updateMapData(
	chartUid: number,
	tms2000: number,
	valueName: string,
	value: number
): Promise<void> {
	return updatePieData(chartUid, tms2000, valueName, value);
}

export async function updateLineChartData(
	chartUid: number,
	value: number,
	line: string,
	tms2000: number
): Promise<void> {
	try {
		await databaseManager
			.getRedisCluster()
			.hincrby(
				`data:${chartUid}.${line}`,
				String(timeUtil.tms2000ToDate(tms2000).getTime()),
				value
			);
	} catch (err) {
		console.error('Error updating line chart data:', err);
	}
}

export async function updateDrilldownPieData(
	chartUid: number,
	tms2000: number,
	valueName: string,
	values: Record<string, number>
): Promise<void> {
	try {
		let totalValue = 0;

		await Promise.all(
			Object.entries(values).map(async ([key, value]) => {
				totalValue += value;
				await databaseManager
					.getRedisCluster()
					.zincrby(`data:${chartUid}.${tms2000}.${valueName}`, value, key);
				await databaseManager
					.getRedisCluster()
					.expire(`data:${chartUid}.${tms2000}.${valueName}`, 60 * 61);
			})
		);

		await databaseManager
			.getRedisCluster()
			.zincrby(`data:${chartUid}.${tms2000}`, totalValue, valueName);
		await databaseManager.getRedisCluster().expire(`data:${chartUid}.${tms2000}`, 60 * 61);
	} catch (err) {
		console.error('Error updating drilldown pie data:', err);
	}
}

export async function updateBarData(
	chartUid: number,
	tms2000: number,
	category: string,
	values: Record<string, number>
): Promise<void> {
	console.warn('updateBarData not yet implemented');
}

export async function addPlugin(
	plugin: Omit<Plugin, 'id'>,
	software: Software
): Promise<number> {
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

export async function getCachedPage(url: string): Promise<string | null> {
	const tms2000 = timeUtil.dateToTms2000(new Date()) - 1;
	return databaseManager.getRedisCluster().get(`urlcache:${tms2000}.${url}`);
}

export async function addPageToCache(url: string, content: string): Promise<void> {
	const tms2000 = timeUtil.dateToTms2000(new Date()) - 1;
	await databaseManager
		.getRedisCluster()
		.set(`urlcache:${tms2000}.${url}`, content, 'EX', 60 * 31);
}
