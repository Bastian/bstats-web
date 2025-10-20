declare module '$lib/server/config.js' {
	const config: {
		redis: Array<{ port: number; host: string }> | { port: number; host: string };
		recaptcha: {
			publicKey: string;
			secretKey: string;
		};
		sessionSecret: string;
	};
	export = config;
}
