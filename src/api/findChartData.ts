import type { ChartData } from "$defs/chart-data/chart-data.interface";
import type { FetchFunction } from "./FetchFunction.type";

export const findChartData = async (
    API_BASE_URL: string,
    id: number,
    maxElements?: number,
    f: FetchFunction = fetch,
): Promise<ChartData> => {
    const queryParams = maxElements ? `?maxElements=${maxElements}` : "";
    const res = await f(`${API_BASE_URL}/charts/${id}/data${queryParams}`);
    return res.json();
};
