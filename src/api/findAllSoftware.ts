import type { Software } from "$defs/software/software.interface";
import type { FetchFunction } from "./FetchFunction.type";

export const findAllSoftware = async (
    API_BASE_URL: string,
    f: FetchFunction = fetch,
): Promise<Software[]> => {
    const res = await f(`${API_BASE_URL}/software`);
    return res.json();
};
