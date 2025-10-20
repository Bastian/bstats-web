// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: { username: string; admin: boolean } | null;
			loggedIn: boolean;
			allSoftware: Array<{
				id: number;
				name: string;
				url: string;
				globalPlugin: boolean;
			}>;
			myPlugins: Array<{
				id: number;
				name: string;
				software: {
					id: number;
					name: string;
					url: string;
				};
			}>;
			customColor1: string;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
