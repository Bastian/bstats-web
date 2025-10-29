<script>
	import { resolve } from '$app/paths';
	import Badge from '$lib/components/Badge.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
</script>

<svelte:head>
	<meta name="description" content="Frequently asked questions about bStats." />
	<title>bStats - FAQ</title>
</svelte:head>

<main class="pb-24">
	<PageHero>
		{#snippet badge()}<Badge>Help</Badge>{/snippet}
		{#snippet title()}Frequently asked questions{/snippet}
		{#snippet content()}
			Answers to common questions about bStats, accounts, and the Metrics class. Still curious?
			Reach out on
			<a
				class="font-semibold text-brand-600 hover:text-brand-700"
				href="https://discord.gg/qTXtXuf"
			>
				Discord
			</a>
			or open an issue on GitHub.
		{/snippet}
	</PageHero>

	<section class="doc-container mt-12 space-y-10">
		<article class="doc-card space-y-4">
			<h2 class="doc-card-title">General</h2>
			<div class="space-y-3">
				<details class="group rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
					<summary
						class="flex cursor-pointer items-center justify-between text-sm font-semibold text-slate-700"
					>
						<span>Will bStats stay free?</span>
						<span
							class="text-xs tracking-[0.2em] text-slate-400 uppercase group-open:text-brand-600"
							>Toggle</span
						>
					</summary>
					<div class="mt-3 text-sm leading-relaxed text-slate-600">
						bStats has no plans to charge for existing features. Thanks to our sponsor
						<a class="font-semibold text-brand-600 hover:text-brand-700" href={resolve('/credits')}
							>GameHosting</a
						> the platform runs without subscription income. Any future premium functionality would be
						optional.
					</div>
				</details>
				<details class="group rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
					<summary
						class="flex cursor-pointer items-center justify-between text-sm font-semibold text-slate-700"
					>
						<span>Why isn't there a "Universal" category?</span>
						<span
							class="text-xs tracking-[0.2em] text-slate-400 uppercase group-open:text-brand-600"
							>Toggle</span
						>
					</summary>
					<div class="mt-3 text-sm leading-relaxed text-slate-600">
						Mixing Bukkit, BungeeCord, and more in a single bucket would double-count players and
						break comparisons. Separate categories keep charts accurate and easy to read.
					</div>
				</details>
				<details class="group rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
					<summary
						class="flex cursor-pointer items-center justify-between text-sm font-semibold text-slate-700"
					>
						<span>Is there an API?</span>
						<span
							class="text-xs tracking-[0.2em] text-slate-400 uppercase group-open:text-brand-600"
							>Toggle</span
						>
					</summary>
					<div class="mt-3 text-sm leading-relaxed text-slate-600">
						Yes. bStats exposes a lightweight REST API for public metrics. Start here:
						<a
							class="font-semibold text-brand-600 hover:text-brand-700"
							href={resolve('/docs/rest-api')}
						>
							REST API documentation
						</a>.
					</div>
				</details>
			</div>
		</article>

		<article class="doc-card space-y-4">
			<h2 class="doc-card-title">Account</h2>
			<div class="space-y-3">
				<details class="group rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
					<summary
						class="flex cursor-pointer items-center justify-between text-sm font-semibold text-slate-700"
					>
						<span>How do I change my password?</span>
						<span
							class="text-xs tracking-[0.2em] text-slate-400 uppercase group-open:text-brand-600"
							>Toggle</span
						>
					</summary>
					<div class="mt-3 text-sm leading-relaxed text-slate-600">
						We don't support self-service password changes yet. If you urgently need an update,
						contact the maintainers and we'll help manually.
					</div>
				</details>
				<details class="group rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
					<summary
						class="flex cursor-pointer items-center justify-between text-sm font-semibold text-slate-700"
					>
						<span>I forgot my password!</span>
						<span
							class="text-xs tracking-[0.2em] text-slate-400 uppercase group-open:text-brand-600"
							>Toggle</span
						>
					</summary>
					<div class="mt-3 text-sm leading-relaxed text-slate-600">
						Drop us a message on Discord or via GitHub Issues. We'll verify your ownership and reset
						the account for you.
					</div>
				</details>
			</div>
		</article>

		<article class="doc-card space-y-4">
			<h2 class="doc-card-title">Metrics class</h2>
			<div class="space-y-3">
				<details class="group rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
					<summary
						class="flex cursor-pointer items-center justify-between text-sm font-semibold text-slate-700"
					>
						<span>How do I add bStats to my plugin?</span>
						<span
							class="text-xs tracking-[0.2em] text-slate-400 uppercase group-open:text-brand-600"
							>Toggle</span
						>
					</summary>
					<div class="mt-3 text-sm leading-relaxed text-slate-600">
						Head over to the <a
							class="font-semibold text-brand-600 hover:text-brand-700"
							href={resolve('/add-plugin')}>integration wizard</a
						> for Maven and manual instructions.
					</div>
				</details>
				<details class="group rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
					<summary
						class="flex cursor-pointer items-center justify-between text-sm font-semibold text-slate-700"
					>
						<span>Where do I report bugs or request features?</span>
						<span
							class="text-xs tracking-[0.2em] text-slate-400 uppercase group-open:text-brand-600"
							>Toggle</span
						>
					</summary>
					<div class="mt-3 text-sm leading-relaxed text-slate-600">
						Website feedback lives on <a
							class="font-semibold text-brand-600 hover:text-brand-700"
							href="https://github.com/Bastian/bStats/issues">the bStats GitHub</a
						>. Metrics class improvements belong on
						<a
							class="font-semibold text-brand-600 hover:text-brand-700"
							href="https://github.com/Bastian/bStats-Metrics/issues">bStats-Metrics</a
						>.
					</div>
				</details>
			</div>
		</article>
	</section>
</main>
