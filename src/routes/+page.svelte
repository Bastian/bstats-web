<script lang="ts">
	import { resolve } from '$app/paths';
	import Badge from '$lib/components/Badge.svelte';
	import Button from '$lib/components/Button.svelte';

	let { data } = $props();
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
				<Badge>Open source since 2016</Badge>
				<h1
					class="mt-6 font-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl"
				>
					Keep tabs on your plugins without losing the fun.
				</h1>
				<p class="mt-6 text-lg leading-relaxed text-slate-600">
					bStats collects plugin metrics so you can see how your hobby projects are doing out in the
					wild. No marketing fluff, just useful graphs, happy players, and a community that tinkers
					together.
				</p>
				<div class="mt-10 flex flex-wrap gap-4">
					<Button href={resolve('/getting-started')} size="large">
						Get started in minutes
						<svg class="h-4 w-4" viewBox="0 0 20 20" fill="none">
							<path
								d="M5 10h10m0 0l-4-4m4 4l-4 4"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</Button>
					<a
						href={resolve('/getting-started/include-metrics')}
						class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-brand-700"
					>
						Read the integration guide
						<svg class="h-4 w-4" viewBox="0 0 20 20" fill="none">
							<path
								d="M5 10h10m0 0l-4-4m4 4l-4 4"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</a>
				</div>
				<dl class="mt-12 grid gap-6 sm:grid-cols-3">
					<div class="rounded-2xl bg-white/80 p-5 shadow-2xl shadow-brand-200/40">
						<dt class="text-xs tracking-wide text-slate-400 uppercase">Plugins reporting in</dt>
						<dd class="mt-2 font-display text-3xl font-semibold text-slate-900">8,724</dd>
					</div>
					<div class="rounded-2xl bg-white/80 p-5 shadow-2xl shadow-brand-200/40">
						<dt class="text-xs tracking-wide text-slate-400 uppercase">Servers sending stats</dt>
						<dd class="mt-2 font-display text-3xl font-semibold text-slate-900">181,975</dd>
					</div>
					<div class="rounded-2xl bg-white/80 p-5 shadow-2xl shadow-brand-200/40">
						<dt class="text-xs tracking-wide text-slate-400 uppercase">Requests processed</dt>
						<dd
							class="mt-2 font-display text-3xl font-semibold text-slate-900"
							data-requests-counter
						>
							0
						</dd>
						<p class="mt-2 text-xs tracking-wide text-slate-400 uppercase">Since you arrived</p>
					</div>
				</dl>
			</div>
			<div class="relative flex-1">
				<div class="absolute inset-x-4 top-0 h-24 rounded-3xl bg-white/50 blur-2xl"></div>
				<div class="relative mx-auto w-full max-w-xl">
					<a
						href={resolve('/plugin/spigot/SkySmith_Toolkit')}
						class="block rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-brand-100/70 transition hover:-translate-y-1 hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-brand-500/60 focus-visible:outline-none"
					>
						<div
							class="flex items-center justify-between text-xs tracking-wide text-slate-400 uppercase"
						>
							<span>Plugin spotlight</span>
							<span class="rounded-full bg-brand-100 px-3 py-1 text-brand-700">Top 100 pick</span>
						</div>
						<h3 class="mt-4 font-display text-2xl font-semibold text-slate-900">
							SkySmith Toolkit
						</h3>
						<p class="mt-2 text-xs tracking-wide text-slate-400 uppercase">Spigot • by AvaBlocks</p>
						<dl
							class="mt-5 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 sm:grid-cols-2"
						>
							<div>
								<dt class="text-xs tracking-wide text-slate-400 uppercase">Servers</dt>
								<dd class="mt-1 font-mono text-lg text-slate-900">1,284</dd>
							</div>
							<div>
								<dt class="text-xs tracking-wide text-slate-400 uppercase">Players</dt>
								<dd class="mt-1 font-mono text-lg text-slate-900">14,902</dd>
							</div>
							<div>
								<dt class="text-xs tracking-wide text-slate-400 uppercase">Software</dt>
								<dd class="mt-1 font-mono text-sm text-slate-900">Spigot</dd>
							</div>
							<div>
								<dt class="text-xs tracking-wide text-slate-400 uppercase">Author</dt>
								<dd class="mt-1 font-mono text-sm text-slate-900">AvaBlocks</dd>
							</div>
						</dl>
						<span
							class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition group-hover:text-brand-700"
						>
							View plugin stats
							<svg class="h-4 w-4" viewBox="0 0 20 20" fill="none">
								<path
									d="M5 10h10m0 0l-4-4m4 4l-4 4"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</span>
					</a>
				</div>
			</div>
		</div>
	</section>

	<section class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl sm:p-12">
			<div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<Badge>Quick start</Badge>
					<h2 class="mt-5 font-display text-3xl font-semibold text-slate-900">
						Ship metrics in under 10 minutes
					</h2>
					<p class="mt-4 text-base leading-relaxed text-slate-600">
						Straight from the <a
							href={resolve('/getting-started/include-metrics')}
							class="font-semibold text-brand-600 hover:text-brand-700">getting started guide</a
						>, trimmed down for weekend coding sessions.
					</p>
				</div>
				<div
					class="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-xs tracking-wide text-slate-500 uppercase"
				>
					<span class="h-2 w-2 animate-pulse rounded-full bg-brand-500"></span>
					No external dependencies
				</div>
			</div>
			<div class="mt-10 grid gap-6 md:grid-cols-3">
				<article
					class="flex flex-col rounded-3xl border border-slate-200 bg-slate-50/60 p-6 shadow-sm"
				>
					<div
						class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700"
					>
						1
					</div>
					<h3 class="mt-4 text-lg font-semibold text-slate-900">Drop the `Metrics` class</h3>
					<p class="mt-3 text-sm leading-relaxed text-slate-600">
						Grab the ready-made class, add it to your plugin, and call the constructor in your
						enable hook. That's your entire setup.
					</p>
					<a
						href={resolve('/getting-started/include-metrics')}
						class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
					>
						Follow the code snippet
						<svg class="h-4 w-4" viewBox="0 0 20 20" fill="none">
							<path
								d="M5 10h10m0 0l-4-4m4 4l-4 4"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</a>
				</article>
				<article
					class="flex flex-col rounded-3xl border border-slate-200 bg-slate-50/60 p-6 shadow-sm"
				>
					<div
						class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700"
					>
						2
					</div>
					<h3 class="mt-4 text-lg font-semibold text-slate-900">Let the first payload fly</h3>
					<p class="mt-3 text-sm leading-relaxed text-slate-600">
						Start your server and bStats will queue the first metrics bundle automatically.
						Everything runs async and respects opt-out configs.
					</p>
					<p class="mt-4 text-xs tracking-wide text-slate-400 uppercase">Pro tip</p>
					<p class="text-sm text-slate-600">
						Keep the default config intact so your community keeps the insight stream flowing.
					</p>
				</article>
				<article
					class="flex flex-col rounded-3xl border border-slate-200 bg-slate-50/60 p-6 shadow-sm"
				>
					<div
						class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700"
					>
						3
					</div>
					<h3 class="mt-4 text-lg font-semibold text-slate-900">Claim and customise</h3>
					<p class="mt-3 text-sm leading-relaxed text-slate-600">
						Create a bStats account, add your plugin, and build the charts you want to show off.
						Invite collaborators whenever you're ready.
					</p>
					<div class="mt-4 flex flex-wrap gap-3 text-sm">
						<Button href={resolve('/register')} variant="primary">Create account</Button>
						<a
							href={resolve('/help/custom-charts')}
							class="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700"
						>
							Browse chart ideas
							<svg class="h-4 w-4" viewBox="0 0 20 20" fill="none">
								<path
									d="M5 10h10m0 0l-4-4m4 4l-4 4"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</a>
					</div>
				</article>
			</div>
			<div
				class="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-slate-100 px-6 py-5 text-sm text-slate-600"
			>
				<div class="flex items-center gap-3">
					<svg class="h-5 w-5 text-brand-500" viewBox="0 0 20 20" fill="none">
						<path
							d="M5 10l3 3 7-7"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					Works across Bukkit, Spigot, Bungeecord, Sponge, and Velocity.
				</div>
				<a
					href={resolve('/getting-started')}
					class="inline-flex items-center gap-2 font-semibold text-brand-600 hover:text-brand-700"
				>
					Read the full guide
					<svg class="h-4 w-4" viewBox="0 0 20 20" fill="none">
						<path
							d="M5 10h10m0 0l-4-4m4 4l-4 4"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</a>
			</div>
		</div>
	</section>

	<section class="border-y border-slate-200 bg-slate-950 py-20 text-slate-100">
		<div class="mx-auto max-w-6xl px-4 sm:px-6">
			<div class="grid gap-12 lg:grid-cols-2">
				<div>
					<Badge>Under the hood</Badge>
					<h2 class="mt-6 font-display text-3xl font-semibold text-white">Built for tinkering.</h2>
					<p class="mt-4 text-base leading-relaxed text-slate-300">
						bStats speaks your language. The API is straightforward, the data exports clean, and the
						source is ready for your pull requests.
					</p>
					<ul class="mt-6 space-y-3 text-sm text-slate-300">
						<li class="flex items-start gap-3">
							<span
								class="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/20 text-brand-200"
							>
								<svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none">
									<path
										d="M5 10l3 3 7-7"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</span>
							<span><strong>REST API</strong> for your own dashboards and bots.</span>
						</li>
						<li class="flex items-start gap-3">
							<span
								class="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/20 text-brand-200"
							>
								<svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none">
									<path
										d="M5 10l3 3 7-7"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</span>
							<span
								><strong>Custom charts</strong> that let you highlight the quirky data that matters to
								you.</span
							>
						</li>
						<li class="flex items-start gap-3">
							<span
								class="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/20 text-brand-200"
							>
								<svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none">
									<path
										d="M5 10l3 3 7-7"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</span>
							<span
								><strong>Shareable profile pages</strong> for your plugins to show off growth to collaborators.</span
							>
						</li>
					</ul>
				</div>
				<div
					class="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-brand-500/10"
				>
					<div
						class="flex items-center justify-between text-xs tracking-wide text-slate-500 uppercase"
					>
						<span>// example usage</span>
						<span>Metrics.java</span>
					</div>
					<pre
						class="mt-4 overflow-auto rounded-2xl bg-slate-950/80 p-6 text-sm text-slate-200"><code
							>{`public class MetricsExample {
    Metrics metrics = new Metrics(plugin, 12345);
    metrics.addCustomChart(new Metrics.SimplePie("game_version", () -> plugin.getVersion()));
    metrics.addCustomChart(new Metrics.MultiLineChart("weekly_players", () -> {
        Map<String, Integer> chartData = new HashMap<>();
        chartData.put("Monday", serverAnalytics.getMondayPlayers());
        chartData.put("Sunday", serverAnalytics.getSundayPlayers());
        return chartData;
    }));
}`}</code
						></pre>
					<p class="mt-5 text-sm text-slate-400">
						Ship that class and a dashboard appears. The rest is up to your creativity.
					</p>
				</div>
			</div>
		</div>
	</section>

	<section class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="flex flex-col gap-8 lg:flex-row">
			<a
				href="https://github.com/Bastian/bStats"
				class="group hover:shadow-3xl flex-1 rounded-3xl bg-slate-900 p-8 text-slate-100 shadow-2xl transition hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-brand-500/60 focus-visible:outline-none"
			>
				<div
					class="inline-flex items-center gap-3 rounded-full bg-slate-800/60 px-4 py-2 text-xs tracking-wide text-slate-300 uppercase"
				>
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M12 2C6.477 2 2 6.486 2 12.021c0 4.42 2.865 8.166 6.839 9.489.5.092.683-.217.683-.483 0-.237-.009-.865-.013-1.697-2.782.607-3.369-1.344-3.369-1.344-.455-1.16-1.11-1.469-1.11-1.469-.908-.62.069-.608.069-.608 1.004.071 1.532 1.033 1.532 1.033.892 1.538 2.341 1.094 2.91.838.091-.649.35-1.095.636-1.347-2.221-.254-4.555-1.114-4.555-4.955 0-1.094.39-1.988 1.03-2.688-.104-.254-.447-1.275.098-2.659 0 0 .84-.27 2.75 1.026a9.45 9.45 0 012.5-.342c.848.004 1.705.116 2.5.342 1.91-1.296 2.748-1.026 2.748-1.026.546 1.384.203 2.405.1 2.659.64.7 1.027 1.594 1.027 2.688 0 3.851-2.339 4.698-4.566 4.947.359.31.68.92.68 1.856 0 1.341-.012 2.422-.012 2.75 0 .268.18.58.688.482A10.012 10.012 0 0022 12.021C22 6.486 17.523 2 12 2z"
							clip-rule="evenodd"
						/>
					</svg>
					Open source home
				</div>
				<h2 class="mt-6 font-display text-3xl font-semibold text-white">Hack on bStats with us</h2>
				<p class="mt-4 text-base leading-relaxed text-slate-300">
					Browse issues, peek at the roadmap, or drop a PR. The repo is full of experiments, vintage
					code, and plenty of places to leave your fingerprints.
				</p>
				<span
					class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-200 transition group-hover:text-brand-100"
				>
					Visit the GitHub project
					<svg class="h-4 w-4" viewBox="0 0 20 20" fill="none">
						<path
							d="M5 10h10m0 0l-4-4m4 4l-4 4"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</span>
			</a>
			<a
				href="https://discord.gg/qTXtXuf"
				class="group hover:shadow-3xl relative flex-1 overflow-hidden rounded-3xl bg-[#5865F2] p-8 text-white shadow-2xl transition hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#8690ff]/80 focus-visible:outline-none"
			>
				<div
					class="absolute top-1/2 -left-16 h-48 w-48 -translate-y-1/2 rounded-full bg-[#4752C4] opacity-70 blur-3xl transition group-hover:scale-110"
				></div>
				<div
					class="absolute -top-16 -right-12 h-40 w-40 rounded-full bg-[#404EED] opacity-80 blur-2xl transition group-hover:rotate-6"
				></div>
				<div class="relative flex items-center gap-4">
					<span
						class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white shadow-lg"
					>
						<img alt="Discord" src="/images/discord.svg" class="h-6 w-6" />
					</span>
					<div>
						<p class="text-xs tracking-wide text-white/70 uppercase">Community hub</p>
						<h2 class="mt-2 font-display text-3xl font-semibold text-white">
							Hang out in the Discord
						</h2>
					</div>
				</div>
				<p class="relative mt-6 text-base leading-relaxed text-white/85">
					Swap ideas, grab instant help, and test-drive fresh dashboard experiments before they go
					live.
				</p>
				<div class="relative mt-6 grid gap-3 text-sm text-white/80">
					<div class="flex items-center gap-2">
						<span class="h-2 w-2 animate-pulse rounded-full bg-[#3BA55D]"></span>
						<span>Live office hours every Thursday</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="h-2 w-2 rounded-full bg-white/50"></span>
						<span>#custom-charts-gallery for inspiration</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="h-2 w-2 rounded-full bg-[#EB459E]"></span>
						<span>Direct line to maintainers for feedback</span>
					</div>
				</div>
				<span
					class="relative mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white transition group-hover:text-white/90"
				>
					Join the conversation
					<svg class="h-4 w-4" viewBox="0 0 20 20" fill="none">
						<path
							d="M5 10h10m0 0l-4-4m4 4l-4 4"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</span>
			</a>
		</div>
	</section>

	<section class="relative isolate overflow-hidden">
		<div
			class="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand-100/60 to-transparent"
		></div>
		<div class="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
			<Badge>Ready when you are</Badge>
			<h2 class="mt-6 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
				Spin up bStats for your next idea.
			</h2>
			<p class="mt-4 text-base leading-relaxed text-slate-600">
				Whether it's a plugin weekend with friends or the project you've been nurturing for years,
				bStats gives you the visibility to keep momentum going.
			</p>
			<div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
				<Button href={resolve('/register')} size="large">Create a free account</Button>
				<a
					href={resolve('/what-is-my-plugin-id')}
					class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-brand-700"
				>
					Already collecting data?
					<svg class="h-4 w-4" viewBox="0 0 20 20" fill="none">
						<path
							d="M5 10h10m0 0l-4-4m4 4l-4 4"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</a>
			</div>
		</div>
	</section>
</main>
