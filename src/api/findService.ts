import type { Service } from "$defs/service.interface";
import type { FetchFunction } from "./FetchFunction.type";

export const findService = async (
    API_BASE_URL: string,
    id: number,
    includeCharts = false,
    f: FetchFunction = fetch
): Promise<Service> => {
    const res = await f(
        `${API_BASE_URL}/services/${id}?includeCharts=${includeCharts}`
    );
    return res.json();
};
