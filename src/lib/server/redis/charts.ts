import * as databaseManager from '../databaseManager.js';
import { getPluginById } from './plugins.js';

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

type ChartField = keyof Omit<Chart, 'uid'>;

const CHART_FIELDS: ChartField[] = ['id', 'type', 'position', 'title', 'default', 'data'];

export async function getChartByUid(uid: number): Promise<Chart | null> {
	const res = await databaseManager.getRedisCluster().hmget(`charts:${uid}`, ...CHART_FIELDS);

	if (res === null || res.every((v) => v === null)) {
		return null;
	}

	const result: Partial<Chart> = { uid };

	for (let i = 0; i < CHART_FIELDS.length; i++) {
		const field = CHART_FIELDS[i];
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
				result[field] = value ?? undefined;
				break;
		}
	}

	return result as Chart;
}

export async function getChartByPluginIdAndChartId(
	pluginId: number,
	chartId: string
): Promise<Chart | null> {
	const chartUid = await databaseManager
		.getRedisCluster()
		.get(`charts.index.uid.pluginId+chartId:${pluginId}.${chartId}`);

	if (chartUid === null) {
		return null;
	}

	return getChartByUid(parseInt(chartUid));
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

export async function getChartsByPluginId(pluginId: number): Promise<Array<Chart> | null> {
	const plugin = await getPluginById(pluginId);

	if (plugin === null || !plugin.charts) {
		return null;
	}

	const charts = await Promise.all(plugin.charts.map((chartUid) => getChartByUid(chartUid)));

	return charts.filter((chart): chart is Chart => chart !== null);
}

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
