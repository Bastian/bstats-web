<script>
	import { resolve } from '$app/paths';
	import Badge from '$lib/components/Badge.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import { Accordion } from '$lib/components/accordion';
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
			<Accordion.Root class="space-y-3">
				<Accordion.Item value="general-1" title="Will bStats stay free?">
					bStats has no plans to charge for existing features. Thanks to our sponsor
					<a class="font-semibold text-brand-600 hover:text-brand-700" href={resolve('/credits')}>
						GameHosting
					</a>
					the platform runs without subscription income. Any future premium functionality would be optional.
				</Accordion.Item>
				<Accordion.Item value="general-2" title="Why isn't there a &quot;Universal&quot; category?">
					Mixing Bukkit, BungeeCord, and more in a single bucket would double-count players and
					break comparisons. Separate categories keep charts accurate and easy to read.
				</Accordion.Item>
				<Accordion.Item value="general-3" title="Is there an API?">
					Yes. bStats exposes a lightweight REST API for public metrics. Start here:
					<a
						class="font-semibold text-brand-600 hover:text-brand-700"
						href={resolve('/docs/rest-api')}
					>
						REST API documentation
					</a>.
				</Accordion.Item>
			</Accordion.Root>
		</article>

		<article class="doc-card space-y-4">
			<h2 class="doc-card-title">Map Charts</h2>
			<Accordion.Root class="space-y-3">
				<Accordion.Item value="maps-1" title="Why are certain borders displayed this way?">
					Map data is provided by Natural Earth, and we follow <a
						class="font-semibold text-brand-600 hover:text-brand-700"
						href="https://www.naturalearthdata.com/about/disputed-boundaries-policy/"
						target="_blank"
						rel="noopener noreferrer"
					>
						their policy on disputed boundaries
					</a>
					to provide a neutral, de facto representation. While we recognize that all borders are inherently
					political, our goal is to provide geographic context, not to take a stance on territorial claims.
				</Accordion.Item>
			</Accordion.Root>
		</article>

		<article class="doc-card space-y-4">
			<h2 class="doc-card-title">Account</h2>
			<Accordion.Root class="space-y-3">
				<Accordion.Item value="account-1" title="How do I change my password?">
					We don't support self-service password changes yet. If you urgently need an update,
					contact the maintainers and we'll help manually.
				</Accordion.Item>
				<Accordion.Item value="account-2" title="I forgot my password!">
					Drop us a message on Discord or via GitHub Issues. We'll verify your ownership and reset
					the account for you.
				</Accordion.Item>
			</Accordion.Root>
		</article>

		<article class="doc-card space-y-4">
			<h2 class="doc-card-title">Metrics class</h2>
			<Accordion.Root class="space-y-3">
				<Accordion.Item value="metrics-1" title="How do I add bStats to my plugin?">
					Head over to the
					<a
						class="font-semibold text-brand-600 hover:text-brand-700"
						href={resolve('/add-plugin')}
					>
						integration wizard
					</a>
					for Maven and manual instructions.
				</Accordion.Item>
				<Accordion.Item value="metrics-2" title="Where do I report bugs or request features?">
					Website feedback lives on
					<a
						class="font-semibold text-brand-600 hover:text-brand-700"
						href="https://github.com/Bastian/bStats/issues"
					>
						the bStats GitHub
					</a>. Metrics class improvements belong on
					<a
						class="font-semibold text-brand-600 hover:text-brand-700"
						href="https://github.com/Bastian/bStats-Metrics/issues"
					>
						bStats-Metrics
					</a>.
				</Accordion.Item>
			</Accordion.Root>
		</article>
	</section>
</main>
