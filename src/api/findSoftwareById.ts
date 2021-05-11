import type { Software } from "$defs/software/software.interface";
import type { FetchFunction } from "./FetchFunction.type";

export const findSoftwareById = async (
    API_BASE_URL: string,
    id: number,
    f: FetchFunction = fetch,
): Promise<Software> => {
    const res = await f(`${API_BASE_URL}/software/${id}`);
    return res.json();
};
