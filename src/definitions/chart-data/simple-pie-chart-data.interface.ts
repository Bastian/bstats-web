import type { ChartData } from "./chart-data.interface";

export type SimplePieChartData = { name: string; y: number }[];

export function isSimplePieChartData(
    data: ChartData
): data is SimplePieChartData {
    return true;
}
