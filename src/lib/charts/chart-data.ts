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
