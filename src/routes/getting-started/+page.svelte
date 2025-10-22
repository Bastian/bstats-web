<script lang="ts">
	import { resolve } from '$app/paths';
	import Badge from '$lib/components/Badge.svelte';
	import Button from '$lib/components/Button.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<meta name="description" content="bStats collects data for plugin authors. Get started now!" />
	<title>bStats - Getting started</title>
</svelte:head>

<main class="pb-24">
	<PageHero>
		{#snippet badge()}<Badge>Documentation</Badge>{/snippet}
		{#snippet title()}Getting started{/snippet}
		{#snippet content()}
			Plug bStats into your project in three moves. Sign in, register, and choose how you want to
			add the Metrics class. Everything else is automatic.
		{/snippet}
	</PageHero>

	<section class="doc-container mt-12 space-y-10">
		<div class="grid gap-6 lg:grid-cols-3">
			<article class="doc-card">
				<h2 class="doc-card-title">1 · Create your account</h2>
				<p class="mt-3 text-sm leading-relaxed text-slate-600">
					Claim your dashboard so you can register plugins, customize charts, and keep track of
					incoming metrics.
				</p>
				<div class="mt-6 flex flex-wrap gap-3 text-sm">
					{#if data.loggedIn}
						<Button href={resolve('/add-plugin')}>Add a plugin</Button>
					{:else}
						<Button href={resolve('/register')}>Create account</Button>
						<a
							href={resolve('/login')}
							class="inline-flex items-center gap-2 text-slate-600 transition hover:text-brand-700"
							>Log in</a
						>
					{/if}
				</div>
			</article>
			<article class="doc-card">
				<h2 class="doc-card-title">2 · Register your plugin</h2>
				<p class="mt-3 text-sm leading-relaxed text-slate-600">
					Give us a name, choose the platform, and we'll hand you a plugin ID. This ID ties your
					Metrics instance to the dashboard.
				</p>
				<p class="mt-4 text-xs tracking-[0.2em] text-slate-400 uppercase">Need a reminder?</p>
				<a
					href={resolve('/what-is-my-plugin-id')}
					class="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
				>
					What is my plugin ID?
				</a>
			</article>
			<article class="doc-card">
				<h2 class="doc-card-title">3 · Include the Metrics class</h2>
				<p class="mt-3 text-sm leading-relaxed text-slate-600">
					Maven shading or manual copy—both flows are supported. Instantiating Metrics is the last
					step.
				</p>
				<a
					href={resolve('/getting-started/include-metrics')}
					class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
				>
					Jump to the integration guide
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
		</div>

		<article class="doc-card doc-section">
			<h2 class="doc-card-title">What data is collected?</h2>
			<p class="text-sm leading-relaxed text-slate-600">
				bStats never collects personal data. Instead we focus on telemetry plugin authors can
				action: player counts, server versions, Java versions, and your own custom metrics. IP
				addresses are only used for rate limiting and never linked to the stored payloads.
			</p>
			<p class="text-sm leading-relaxed text-slate-600">
				All collected data is public. Curious what a plugin is sending? Visit its dashboard and
				inspect the charts.
			</p>
		</article>

		<div class="grid gap-6 lg:grid-cols-2">
			<article class="doc-card space-y-4">
				<h2 class="doc-card-title">Custom charts</h2>
				<p class="text-sm leading-relaxed text-slate-600">
					Collect the signals your plugin needs with custom charts. Build pies, lines, and bar
					charts to highlight your feature adoption, configuration choices, or heuristics.
				</p>
				<div class="flex flex-wrap gap-3 text-sm">
					<a
						href={resolve('/help/custom-charts')}
						class="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
					>
						Explore examples
					</a>
					<a
						href={resolve('/help/rest-api')}
						class="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
					>
						REST API guide
					</a>
				</div>
			</article>

			<article class="doc-card space-y-4">
				<h2 class="doc-card-title">Disabling bStats</h2>
				<p class="text-sm leading-relaxed text-slate-600">
					Server owners can opt out by editing <code class="font-mono text-slate-700"
						>/plugins/bStats/config.yml</code
					>. We encourage keeping metrics enabled—insights motivate maintainers and help the
					community prioritise features.
				</p>
			</article>
		</div>
	</section>
</main>
