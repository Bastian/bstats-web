declare module '$lib/server/auth.js' {
	import type { PassportStatic } from 'passport';
	function authConfig(passport: PassportStatic): void;
	export = authConfig;
}
