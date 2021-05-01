import type {FetchFunction} from "./FetchFunction.type";
import type {Software} from "../definitions/software/software.interface";

export const findAllSoftware = async (
    API_BASE_URL: string,
    f: FetchFunction = fetch,
): Promise<Software[]> => {
    const res = await f(`${API_BASE_URL}/software`);
    return res.json();
};
