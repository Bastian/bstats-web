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

const SOFTWARE_FIELDS: SoftwareField[] = [
    'name',
    'url',
    'globalPlugin',
    'metricsClass',
    'examplePlugin',
    'maxRequestsPerIp',
    'defaultCharts',
    'hideInPluginList'
];

export async function getSoftwareById(id: number): Promise<Software> {
    const res = await databaseManager.getRedisCluster().hmget(`software:${id}`, ...SOFTWARE_FIELDS);

    const result: Partial<Software> = { id: parseInt(String(id)) };

    for (let i = 0; i < SOFTWARE_FIELDS.length; i++) {
        const field = SOFTWARE_FIELDS[i];
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (result as any)[field] = value ?? undefined;
                break;
        }
    }

    return result as Software;
}

export async function getSoftwareByUrl(url: string): Promise<Software | null> {
    const normalizedUrl = url.toLowerCase();
    const softwareId = await databaseManager
        .getRedisCluster()
        .get(`software.index.id.url:${normalizedUrl}`);

    if (softwareId === null) {
        return null;
    }

    return getSoftwareById(parseInt(softwareId));
}

export async function getAllSoftwareIds(): Promise<number[]> {
    const res = await databaseManager.getRedisCluster().smembers('software.ids');
    return res.map((id) => parseInt(id));
}

export async function getAllSoftware(): Promise<Array<Software>> {
    const softwareIds = await getAllSoftwareIds();
    return Promise.all(softwareIds.map((id) => getSoftwareById(id)));
}
