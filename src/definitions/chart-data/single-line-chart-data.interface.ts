import type { ChartData } from "./chart-data.interface";

export type SingleLineChartData = [number, number][];

export function isSingleLineChartData(
    data: ChartData
): data is SingleLineChartData {
    return true;
}
