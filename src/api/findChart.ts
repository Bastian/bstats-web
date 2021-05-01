import type {FetchFunction} from "./FetchFunction.type";
import type {Chart} from "../definitions/chart.interface";

export const findChart = async (
    API_BASE_URL: string,
    id: number,
    f: FetchFunction = fetch,
): Promise<Chart> => {
    const res = await f(`${API_BASE_URL}/charts/${id}`);
    return res.json();
};
