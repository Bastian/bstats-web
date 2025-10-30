<script lang="ts">
	import { resolve } from '$app/paths';
	import Badge from '$lib/components/Badge.svelte';
	import Button from '$lib/components/Button.svelte';
	import type { Snippet } from 'svelte';
	import type { PageData } from './$types';
	import IconArrowRight from '@tabler/icons-svelte/icons/arrow-right';

	import githubIcon from '../../static/images/github-mark.svg';
	import discordIcon from '../../static/images/Discord-Symbol-White.svg';
	import gamehostingLogo from '$lib/assets/images/logos/gamehosting.png';

	let { data }: { data: PageData } = $props();

	const formatter = new Intl.NumberFormat();
</script>

<svelte:head>
	<!-- Twitter stuff -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@btobastian" />
	<meta name="twitter:title" content="bStats - Plugin Metrics made with <3" />
	<meta
		name="twitter:description"
		content="bStats collects data for plugin authors. It's free and easy to use!"
	/>
	<meta name="twitter:image" content="https://bstats.org/images/Twitter.jpg" />

	<meta
		name="description"
		content="bStats collects data for plugin authors. It's free and easy to use!"
	/>
	<title>bStats</title>
</svelte:head>

<main>
	<!-- Hero -->
	<section class="relative overflow-hidden border-b border-slate-200/60">
		<div class="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-sky-100"></div>
		<div
			class="absolute top-[-8rem] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-200/40 blur-3xl"
		></div>
		<div
			class="absolute right-[-6rem] bottom-[-6rem] h-64 w-64 rounded-full bg-sky-200/50 blur-3xl"
		></div>
		<div
			class="relative mx-auto flex max-w-6xl flex-col gap-16 px-4 py-24 sm:px-6 lg:flex-row lg:items-center lg:py-28"
		>
			<div class="max-w-2xl">
				<h1
					class="mt-6 font-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl"
				>
					Ever wondered how many servers run your plugin?
				</h1>
				<p class="mt-6 text-lg leading-relaxed text-slate-600">
					bStats shows you exactly that. See server counts, version adoption, and custom metrics
					across every major Minecraft server platform. Free to use, respects privacy, and
					integrates in minutes.
				</p>
				<div class="mt-10 flex flex-wrap gap-4">
					<Button href={resolve('/add-plugin')} size="large">Get started in minutes</Button>
					<a
						href={resolve('/plugin-list')}
						class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-brand-700"
					>
						Browse plugin list
						<IconArrowRight size={18} />
					</a>
				</div>
			</div>

			<!-- Spotlight card -->
			{#if data.spotlightPlugin}
				<div class="relative min-w-0 flex-1">
					<div class="absolute inset-x-4 top-0 h-24 rounded-3xl bg-white/50 blur-2xl"></div>
					<div class="relative mx-auto w-full max-w-xl overflow-hidden">
						<a
							href={resolve(
								`/plugin/${data.spotlightPlugin.softwareUrl}/${data.spotlightPlugin.name}/${data.spotlightPlugin.pluginId}`
							)}
							class="block rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-brand-100/70 transition hover:-translate-y-1 hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-brand-500/60 focus-visible:outline-none"
						>
							<div
								class="flex items-center justify-between text-xs tracking-wide text-slate-500 uppercase"
							>
								<span>Plugin spotlight</span>
								<span class="rounded-full bg-brand-100 px-3 py-1 text-brand-700">Top 100</span>
							</div>
							<h3 class="mt-4 font-display text-2xl font-semibold break-words text-slate-900">
								{data.spotlightPlugin.name}
							</h3>
							<p class="mt-2 text-xs tracking-wide break-words text-slate-500 uppercase">
								by {data.spotlightPlugin.ownerName}
							</p>
							<dl
								class="mt-5 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 sm:grid-cols-2"
							>
								<div>
									<dt class="text-xs tracking-wide text-slate-500 uppercase">Servers</dt>
									<dd class="mt-1 font-mono text-lg text-slate-900">
										{formatter.format(data.spotlightPlugin.servers)}
									</dd>
								</div>
								<div>
									<dt class="text-xs tracking-wide text-slate-500 uppercase">Players</dt>
									<dd class="mt-1 font-mono text-lg text-slate-900">
										{formatter.format(data.spotlightPlugin.players)}
									</dd>
								</div>
								<div>
									<dt class="text-xs tracking-wide text-slate-500 uppercase sm:col-span-2 sm:mt-3">
										Platform
									</dt>
									<dd class="mt-1 font-mono text-sm text-slate-900">
										{data.spotlightPlugin.softwareName}
									</dd>
								</div>
							</dl>
							<span
								class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition group-hover:text-brand-700"
							>
								View plugin stats
								<IconArrowRight size={18} />
							</span>
						</a>
					</div>
				</div>
			{/if}
		</div>
	</section>

	<!-- Quick start -->
	<section class="mx-auto max-w-7xl px-4 py-20 sm:px-6">
		<div
			class="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-xl sm:p-12"
		>
			<div class="grid gap-10 xl:grid-cols-2 xl:items-end">
				<div>
					<Badge>Quick start</Badge>
					<h2 class="mt-5 font-display text-3xl font-semibold text-slate-900">
						Integrate bStats in 2 easy steps
					</h2>
					<p class="mt-4 text-base leading-relaxed text-slate-600">
						View the
						<a href={resolve('/docs')} class="font-semibold text-brand-600 hover:text-brand-700">
							getting started guide
						</a>
						for detailed instructions.
					</p>

					<ol role="list" class="mt-8 space-y-5 lg:grid lg:grid-cols-2 lg:gap-8 xl:block xl:gap-0">
						<li
							class="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 lg:h-full xl:h-auto"
						>
							<div
								aria-hidden="true"
								class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700"
							>
								1
							</div>
							<div>
								<h3 class="text-lg font-semibold text-slate-900">Register your plugin</h3>
								<p class="mt-2 max-w-prose text-sm leading-relaxed text-slate-600">
									Sign up for free and add your plugin to receive a unique plugin&nbsp;ID.
								</p>
								{#if !data.session}
									<div class="mt-3">
										<Button href={resolve('/register')} variant="primary">Create account</Button>
									</div>
								{:else}
									<div class="mt-3">
										<Button href={resolve('/add-plugin')} variant="primary">Add plugin</Button>
									</div>
								{/if}
							</div>
						</li>

						<li
							class="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 lg:h-full xl:h-auto"
						>
							<div
								aria-hidden="true"
								class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700"
							>
								2
							</div>
							<div>
								<h3 class="text-lg font-semibold text-slate-900">Add bStats to your code</h3>
								<p class="mt-2 max-w-prose text-sm leading-relaxed text-slate-600">
									Include the `Metrics` class and initialize it with your plugin ID. Supports all
									major platforms and build tools.
								</p>
								<a
									href={resolve('/add-plugin')}
									class="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
								>
									Start integration wizard
									<IconArrowRight size={18} />
								</a>
							</div>
						</li>
					</ol>
				</div>

				<div class="relative min-w-0">
					<div
						class="flex max-w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-800 p-5 text-slate-100 shadow-md"
					>
						<div class="flex items-center justify-between">
							<span class="text-xs tracking-wide text-slate-400 uppercase">
								Example (Bukkit / Spigot)
							</span>
						</div>
						<div
							class="relative mt-4 max-w-full overflow-x-auto rounded-xl bg-slate-900 px-3 py-4 text-sm leading-relaxed shadow-inner sm:px-4 sm:py-6 [&>*]:bg-slate-900!"
						>
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html data.highlightedCode}
						</div>
						<p class="mt-3 text-xs text-slate-400">
							Works across Bukkit, Spigot, Paper, Velocity and more.
						</p>
					</div>

					<div
						class="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-100 px-5 py-4 text-sm text-slate-600"
					>
						<a
							href={resolve('/docs')}
							class="inline-flex items-center gap-2 font-semibold text-brand-600 hover:text-brand-700"
						>
							Read the full guide
							<IconArrowRight size={18} />
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Sponsor -->
	<section class="border-t border-slate-200 bg-white">
		<div class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
			<div class="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
				<!-- Left column: Content -->
				<div>
					<Badge>Sponsor</Badge>
					<h2 class="mt-5 font-display text-3xl font-semibold text-slate-900">
						Proudly sponsored by GameHosting.it
					</h2>
					<p class="mt-4 text-base leading-relaxed text-slate-600">
						Italy's leading game server hosting provider, offering premium Minecraft servers, VPS
						hosting, and dedicated servers with competitive pricing and exceptional support.
					</p>
					<div class="mt-6 space-y-3">
						<div class="flex items-center gap-3 text-sm text-slate-600">
							<svg
								class="h-5 w-5 text-brand-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
							<span>Premium hardware & Milan-based infrastructure</span>
						</div>
						<div class="flex items-center gap-3 text-sm text-slate-600">
							<svg
								class="h-5 w-5 text-brand-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
							<span>Instant activation & advanced control panels</span>
						</div>
						<div class="flex items-center gap-3 text-sm text-slate-600">
							<svg
								class="h-5 w-5 text-brand-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
							<span>Comprehensive support during business hours</span>
						</div>
					</div>
					<a
						href="https://www.gamehosting.it/"
						target="_blank"
						rel="noopener noreferrer"
						class="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
					>
						Visit GameHosting.it
						<IconArrowRight size={18} class="transition hover:translate-x-1" />
					</a>
				</div>

				<!-- Right column: Logo -->
				<div class="flex items-center justify-center lg:justify-end">
					<a
						href="https://www.gamehosting.it/"
						target="_blank"
						rel="noopener noreferrer"
						class="block rounded-2xl bg-slate-900 px-12 py-10 transition hover:scale-105"
					>
						<img src={gamehostingLogo} alt="GameHosting.it" class="h-32 w-auto" />
					</a>
				</div>
			</div>
		</div>
	</section>

	<!-- Community -->
	<section class="relative border-t border-slate-200 bg-white">
		<div class="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-slate-100"></div>
		<div
			class="absolute inset-x-0 top-32 h-72 bg-gradient-to-r from-brand-100/40 via-white to-brand-200/40 blur-3xl"
		></div>
		<div class="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
			<div class="mx-auto max-w-2xl text-center">
				<Badge>Community</Badge>
				<h2 class="mt-5 font-display text-3xl font-semibold text-slate-900">
					Join the bStats community
				</h2>
			</div>

			<div class="mt-12 grid gap-6 sm:grid-cols-2">
				{#snippet Card(data: {
					title: string;
					subtitle: string;
					description: string;
					linkText: string;
					href: string;
					icon: Snippet;
				})}
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
					<a
						href={data.href}
						target="_blank"
						rel="noopener noreferrer"
						class="block rounded-3xl focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-2 focus-visible:outline-none"
					>
						<article
							class="group relative flex h-full flex-col gap-6 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur transition duration-200 hover:-translate-y-1 hover:shadow-xl"
						>
							<div class="flex items-center gap-4">
								{@render data.icon()}
								<div>
									<h3 class="font-display text-xl font-semibold text-slate-900">
										{data.title}
									</h3>
									<p class="mt-1 text-sm text-slate-500">
										{data.subtitle}
									</p>
								</div>
							</div>
							<p class="text-sm leading-relaxed text-slate-600">
								{data.description}
							</p>
							<div class="flex items-center gap-1 text-slate-700">
								{data.linkText}
								<IconArrowRight size={18} aria-hidden="true" />
							</div>
						</article>
					</a>
				{/snippet}

				{#snippet GitHubIcon()}
					<img alt="GitHub" src={githubIcon} class="h-12 w-12 rounded-full" />
				{/snippet}

				{#snippet DiscordIcon()}
					<span
						class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-discord-blurple text-white"
					>
						<img alt="Discord" src={discordIcon} class="h-7 w-7" />
					</span>
				{/snippet}

				{@render Card({
					title: 'Gift bStats a star on GitHub',
					href: 'https://github.com/Bastian/bStats',
					subtitle: 'Issue tracker, pull requests, source code.',
					description: 'Browse the code, report bugs, or submit improvements.',
					linkText: 'Open GitHub',
					icon: GitHubIcon
				})}

				{@render Card({
					title: 'Chat with us on Discord',
					href: 'https://discord.gg/qTXtXuf',
					subtitle: 'Support, discussions, release news.',
					description: 'Drop by whenever you need help or want to share feedback.',
					linkText: 'Join Discord',
					icon: DiscordIcon
				})}
			</div>
		</div>
	</section>
</main>
