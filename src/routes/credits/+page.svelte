<script>
	import Badge from '$lib/components/Badge.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
</script>

<svelte:head>
	<meta name="description" content="Acknowledgements and sponsors behind bStats." />
	<title>bStats - Credits</title>
</svelte:head>

<main class="pb-24">
	<PageHero>
		{#snippet badge()}<Badge>Credits</Badge>{/snippet}
		{#snippet title()}People and partners{/snippet}
		{#snippet content()}
			bStats runs on community contributions and infrastructure provided by our sponsor. Thank you
			for keeping the project going.
		{/snippet}
	</PageHero>

	<section class="doc-container mt-12 space-y-8">
		<article class="doc-card space-y-4">
			<h2 class="doc-card-title">Sponsor</h2>
			<p class="text-sm leading-relaxed text-slate-600">
				GameHosting provides the resources that keep the platform online—and free for everyone.
			</p>
			<a
				href="https://www.gamehosting.it/"
				class="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-brand-600 transition hover:border-brand-200 hover:text-brand-700"
				target="_blank"
				rel="noopener"
			>
				Visit GameHosting
			</a>
		</article>

		<article class="doc-card space-y-4">
			<h2 class="doc-card-title">Author</h2>
			<div class="flex flex-col gap-1 text-sm text-slate-600">
				<span class="font-semibold text-slate-900">BtoBastian</span>
				<a
					href="http://bastian-oppermann.de"
					class="inline-flex w-fit items-center gap-2 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
					target="_blank"
					rel="noopener"
				>
					bastian-oppermann.de
				</a>
			</div>
		</article>

		<article class="doc-card space-y-4">
			<h2 class="doc-card-title">Testers & friends</h2>
			<ul class="space-y-2 text-sm text-slate-600">
				<li class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
					<span class="font-semibold text-slate-900">f_</span> — coined the name "bStats" and insisted
					we add a credits page.
				</li>
			</ul>
		</article>

		<article class="doc-card space-y-4">
			<h2 class="doc-card-title">Special thanks</h2>
			<ul class="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
				<li class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
					<span class="font-semibold text-slate-900">Cloudflare</span>
					<a
						href="https://www.cloudflare.com/"
						class="mt-1 block text-xs tracking-[0.2em] text-brand-600 uppercase hover:text-brand-700"
						target="_blank"
						rel="noopener">Website</a
					>
				</li>
				<li class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
					<span class="font-semibold text-slate-900">Highcharts</span>
					<a
						href="https://www.highcharts.com/"
						class="mt-1 block text-xs tracking-[0.2em] text-brand-600 uppercase hover:text-brand-700"
						target="_blank"
						rel="noopener">Website</a
					>
				</li>
			</ul>
		</article>
	</section>
</main>
