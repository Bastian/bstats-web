import type {FetchFunction} from "./FetchFunction.type";
import type {Service} from "../definitions/service.interface";

export const findService = async (
    API_BASE_URL: string,
    id: number,
    includeCharts: boolean = false,
    f: FetchFunction = fetch,
): Promise<Service> => {
    const res = await f(`${API_BASE_URL}/services/${id}?includeCharts=${includeCharts}`);
    return res.json();
}
