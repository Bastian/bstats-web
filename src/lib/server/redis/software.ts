import * as databaseManager from '../databaseManager.js';

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

type SoftwareField = keyof Omit<Software, 'id'>;

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
