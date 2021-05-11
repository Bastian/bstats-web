import type { Load } from "@sveltejs/kit";

export type FetchFunction = Parameters<Load>[0]["fetch"];
