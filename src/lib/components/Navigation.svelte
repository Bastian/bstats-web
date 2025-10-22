<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { resolve } from '$app/paths';

	type Software = {
		id: number;
		name: string;
		url: string;
		globalPlugin: boolean;
	};

	type Plugin = {
		id: number;
		name: string;
		software: {
			id: number;
			name: string;
			url: string;
		};
	};

	type User = {
		username: string;
		admin: boolean;
	};

	let {
		loggedIn = false,
		user = null,
		allSoftware = [],
		myPlugins = []
	} = $props<{
		loggedIn?: boolean;
		user?: User | null;
		allSoftware?: Software[];
		myPlugins?: Plugin[];
	}>();

	const globalSoftware = $derived(
		allSoftware.filter((software) => software && software.globalPlugin)
	);
	const plugins = $derived(myPlugins || []);
	const username = $derived(loggedIn && user && user.username ? user.username : '');
	const usernameInitial = $derived(username ? username.charAt(0).toUpperCase() : '🙂');
</script>

<header class="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
	<div class="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
		<a href={resolve('/')} class="group flex items-center gap-3">
			<span
				class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 font-display text-lg font-semibold text-white shadow-floating transition-transform group-hover:-translate-y-0.5 md:text-xl"
			>
				bS
			</span>
			<span class="flex flex-col leading-tight">
				<span class="font-display text-xl font-semibold text-slate-900 md:text-2xl">bStats</span>
				<span class="text-xs font-medium tracking-wide text-slate-400 uppercase"
					>Open source metrics</span
				>
			</span>
		</a>

		<nav class="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
			<a href={resolve('/plugin-list')} class="transition hover:text-slate-900">Plugin List</a>
			<a href={resolve('/getting-started')} class="transition hover:text-slate-900">Docs</a>
			{#if globalSoftware.length}
				<details class="group relative">
					<summary
						class="flex items-center gap-1 rounded-full bg-slate-100/80 px-3 py-1.5 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
					>
						Global Stats
						<svg class="h-4 w-4 transition group-open:rotate-180" viewBox="0 0 20 20" fill="none">
							<path
								d="M5 7.5L10 12.5L15 7.5"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</summary>
					<div
						class="pointer-events-none invisible absolute top-full left-1/2 z-20 mt-3 w-72 -translate-x-1/2 -translate-y-1 rounded-xl border border-slate-200 bg-white/95 p-3 opacity-0 shadow-2xl transition-all duration-200 group-open:pointer-events-auto group-open:visible group-open:translate-y-0 group-open:opacity-100"
					>
						<ul class="space-y-1.5 text-sm">
							{#each globalSoftware as software}
								<li>
									<a
										href={resolve(`/global/${software.url}`)}
										class="flex items-center justify-between rounded-lg px-3 py-2 text-slate-600 transition hover:bg-brand-50 hover:text-slate-900"
									>
										<span>{software.name}</span>
										<svg class="h-4 w-4 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M13.293 9.293a1 1 0 0 1 1.414 1.414l-4.586 4.586A1 1 0 0 1 8 14.586V6a1 1 0 0 1 2 0v6.172l3.293-3.293z"
												clip-rule="evenodd"
											/>
										</svg>
									</a>
								</li>
							{/each}
						</ul>
						<div class="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
							Curious how it works? Dive into the <a
								href={resolve('/faq')}
								class="font-semibold text-brand-600 hover:text-brand-700">FAQ</a
							>.
						</div>
					</div>
				</details>
			{/if}
		</nav>

		<div class="hidden items-center gap-3 md:flex">
			{#if loggedIn}
				<Button href={resolve('/add-plugin')}>Add Plugin</Button>
				<details class="group relative">
					<summary
						class="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:border-brand-200 hover:text-brand-700"
					>
						<span
							class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 font-display text-sm font-semibold text-brand-700"
							>{usernameInitial}</span
						>
						<span>Account</span>
						<svg class="h-4 w-4 transition group-open:rotate-180" viewBox="0 0 20 20" fill="none">
							<path
								d="M5 7.5L10 12.5L15 7.5"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</summary>
					<div
						class="pointer-events-none invisible absolute top-full right-0 z-20 mt-3 w-56 -translate-y-1 rounded-xl border border-slate-200 bg-white/95 p-3 text-sm text-slate-600 opacity-0 shadow-2xl transition-all duration-200 group-open:pointer-events-auto group-open:visible group-open:translate-y-0 group-open:opacity-100"
					>
						<div class="mb-2 rounded-lg bg-slate-50 p-3">
							<p class="text-xs tracking-wide text-slate-400 uppercase">Signed in as</p>
							<p class="font-semibold text-slate-700">{username || 'bStats user'}</p>
						</div>
						<ul class="space-y-1">
							<li>
								<a
									href={resolve(`/author/${username}`)}
									class="block rounded-md px-3 py-2 transition hover:bg-brand-50 hover:text-slate-900"
									>My page</a
								>
							</li>
							{#if plugins.length}
								<li>
									<p class="px-3 pt-2 text-xs tracking-wide text-slate-400 uppercase">My Plugins</p>
									<ul
										class="mt-2 max-h-40 space-y-1 overflow-y-auto rounded-md bg-slate-50 p-2 text-sm"
									>
										{#each plugins as plugin}
											<li>
												<a
													href={resolve(`/plugin/${plugin.software.url}/${plugin.name}`)}
													class="block truncate rounded px-2 py-1 transition hover:bg-white hover:text-brand-700"
												>
													{plugin.name}
													<span class="text-xs tracking-wide text-slate-400 uppercase"
														>({plugin.software.name})</span
													>
												</a>
											</li>
										{/each}
									</ul>
								</li>
							{/if}
							<li>
								<a
									href={resolve('/change-password')}
									class="block rounded-md px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
									>Change password</a
								>
							</li>
							<li>
								<a
									href={resolve('/logout')}
									class="block rounded-md px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
									>Logout</a
								>
							</li>
						</ul>
					</div>
				</details>
			{:else}
				<a
					href={resolve('/login')}
					class="text-sm font-semibold text-slate-600 transition hover:text-slate-900">Log in</a
				>
				<Button href={resolve('/register')}>Create account</Button>
			{/if}
		</div>

		<button
			type="button"
			class="inline-flex items-center justify-center rounded-full bg-white p-2 text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 md:hidden"
			aria-expanded="false"
			data-mobile-nav-toggle
		>
			<span class="sr-only">Toggle navigation</span>
			<svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
			</svg>
		</button>
	</div>

	<div
		class="mobile-nav hidden border-t border-slate-200 bg-white/95 px-4 py-6 shadow-lg transition md:hidden"
		data-mobile-nav-panel
	>
		<div class="mx-auto flex max-w-6xl flex-col gap-6 text-base font-medium text-slate-700">
			<nav class="space-y-3">
				<a
					href={resolve('/plugin-list')}
					class="block rounded-lg px-4 py-3 transition hover:bg-brand-50 hover:text-brand-700"
					>Plugin List</a
				>
				<a
					href={resolve('/getting-started')}
					class="block rounded-lg px-4 py-3 transition hover:bg-brand-50 hover:text-brand-700"
					>Docs</a
				>
				{#if globalSoftware.length}
					<div class="rounded-2xl bg-slate-100/80 p-4">
						<p class="text-xs tracking-wide text-slate-400 uppercase">Global Stats</p>
						<ul class="mt-3 space-y-2 text-sm">
							{#each globalSoftware as software}
								<li>
									<a
										href={resolve(`/global/${software.url}`)}
										class="flex items-center justify-between rounded-lg bg-white px-3 py-2 shadow-sm transition hover:text-brand-700"
									>
										<span>{software.name}</span>
										<svg class="h-4 w-4 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M7.293 14.707a1 1 0 0 1 0-1.414L10.586 10 7.293 6.707A1 1 0 0 1 8.707 5.293l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0Z"
												clip-rule="evenodd"
											/>
										</svg>
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</nav>

			<div class="space-y-3 rounded-2xl bg-slate-900 px-5 py-6 text-slate-100">
				<p class="text-xs tracking-wide text-brand-200 uppercase">Community vibes</p>
				<p class="text-sm text-slate-200">
					Made for hobbyists, powered by volunteers, and always open source.
				</p>
			</div>

			{#if loggedIn}
				<div class="space-y-2">
					<Button href={resolve('/add-plugin')} fullWidth>
						<span>Add Plugin</span>
					</Button>
					<a
						href={resolve(`/author/${username}`)}
						class="block rounded-lg border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
						>My page</a
					>
					<a
						href={resolve('/change-password')}
						class="block rounded-lg border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
						>Change password</a
					>
					<a
						href={resolve('/logout')}
						class="block rounded-lg border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
						>Logout</a
					>
					{#if plugins.length}
						<div class="rounded-2xl bg-slate-100/80 p-4">
							<p class="text-xs tracking-wide text-slate-400 uppercase">My Plugins</p>
							<ul class="mt-3 space-y-2 text-sm">
								{#each plugins as plugin}
									<li>
										<a
											href={resolve(`/plugin/${plugin.software.url}/${plugin.name}`)}
											class="block truncate rounded-lg bg-white px-3 py-2 shadow-sm transition hover:text-brand-700"
										>
											{plugin.name}
											<span class="text-xs tracking-wide text-slate-400 uppercase"
												>({plugin.software.name})</span
											>
										</a>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			{:else}
				<div class="flex flex-col gap-3">
					<a
						href={resolve('/login')}
						class="block rounded-lg border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
						>Log in</a
					>
					<Button href={resolve('/register')} fullWidth>Create account</Button>
				</div>
			{/if}
		</div>
	</div>
</header>
