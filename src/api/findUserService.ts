import type { Service } from "$defs/service.interface";
import type { FetchFunction } from "./FetchFunction.type";

export const findUserService = async (
    API_BASE_URL: string,
    uid?: string,
    includeCharts = false,
    f: FetchFunction = fetch
): Promise<Service> => {
    const res = await f(
        `${API_BASE_URL}/services/users${
            uid ? "/" + uid : ""
        }?includeCharts=${includeCharts}`
    );
    return res.json();
};
