import type {FetchFunction} from "./FetchFunction.type";
import type {Software} from "../definitions/software/software.interface";

export const findSoftwareByUrl = async (
    API_BASE_URL: string,
    url: string,
    f: FetchFunction = fetch,
): Promise<Software> => {
    const res = await f(`${API_BASE_URL}/software/url/${url}`);
    return res.json();
}
