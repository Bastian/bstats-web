/**
 * Utilities for fetching chart data from the API
 */

export interface SimplePieChartData {
    name: string;
    y: number;
}

export interface DrilldownPieChartData {
    seriesData: { name: string; y: number; drilldown: string }[];
    drilldownData: { name: string; id: string; data: [string, number][] }[];
}

export type LineChartData = [number, number][]; // [timestamp, value][]

export interface BarChartData {
    name: string;
    data: number[];
}

export interface MapChartData {
    code: string;
    value: number;
}

export type ChartData =
    | SimplePieChartData[]
    | DrilldownPieChartData
    | LineChartData
    | BarChartData[]
    | MapChartData[];

export interface ChartMetadata {
    uid: number;
    id: string;
    type: string;
    position: number;
    title: string;
    data?: Record<string, unknown>;
}

/**
 * Fetch chart data from the API
 * @param chartUid - The chart UID
 * @param maxElements - Optional max elements for line charts
 * @returns Chart data
 */
export async function fetchChartData(chartUid: number, maxElements?: number): Promise<ChartData> {
    const url = maxElements
        ? `/api/v2/charts/${chartUid}/data?maxElements=${maxElements}`
        : `/api/v2/charts/${chartUid}/data`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch chart data: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Fetch list of charts for a plugin
 * @param pluginId - The plugin ID
 * @returns Object with chart IDs as keys and chart metadata as values
 */
export async function fetchCharts(pluginId: number): Promise<Record<string, ChartMetadata>> {
    const response = await fetch(`/api/v1/plugins/${pluginId}/charts`);
    if (!response.ok) {
        throw new Error(`Failed to fetch charts: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Group small items into an "Other" category for pie charts.
 * Only applies when there are more than 20 items.
 * Items with less than 0.5% of the total are grouped into "Other".
 *
 * @param data - Array of items with name and value
 * @returns New array with small items grouped into "Other"
 */
export function groupSmallItemsIntoOther<T extends { name: string; y: number }>(data: T[]): T[] {
    if (data.length <= 20) {
        return data;
    }

    const total = data.reduce((sum, item) => sum + item.y, 0);
    const threshold = total / 200; // 0.5%

    const result: T[] = [];
    let otherCount = 0;

    for (const item of data) {
        if (item.y < threshold) {
            otherCount += item.y;
        } else {
            result.push(item);
        }
    }

    if (otherCount > 0) {
        result.push({ name: 'Other', y: otherCount } as T);
    }

    return result;
}

/**
 * Group small items into an "Other" category for drilldown data.
 * Only applies when there are more than 20 items.
 * Items with less than 0.5% of the total are grouped into "Other".
 *
 * @param data - Array of [name, value] tuples
 * @returns New array with small items grouped into "Other"
 */
export function groupSmallDrilldownItemsIntoOther(data: [string, number][]): [string, number][] {
    if (data.length <= 20) {
        return data;
    }

    const total = data.reduce((sum, [, value]) => sum + value, 0);
    const threshold = total / 200; // 0.5%

    const result: [string, number][] = [];
    let otherCount = 0;

    for (const [name, value] of data) {
        if (value < threshold) {
            otherCount += value;
        } else {
            result.push([name, value]);
        }
    }

    if (otherCount > 0) {
        result.push(['Other', otherCount]);
    }

    return result;
}
