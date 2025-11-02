// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { auth } from '$lib/auth';

type Session = typeof auth.$Infer.Session;

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: Session['user'] | null;
			session: Session['session'] | null;
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
