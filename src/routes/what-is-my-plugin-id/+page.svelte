<script lang="ts">
	import { resolve } from '$app/paths';
	import Badge from '$lib/components/Badge.svelte';
	import Button from '$lib/components/Button.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let searchValue = $state('');
	let filteredPlugins = $derived(
		data.myPlugins.filter((plugin) => {
			const query = searchValue.trim().toLowerCase();
			if (!query) return true;
			return (
				plugin.name.toLowerCase().includes(query) ||
				plugin.software.name.toLowerCase().includes(query)
			);
		})
	);

	async function copyToClipboard(pluginId: number, event: MouseEvent) {
		const button = event.currentTarget as HTMLButtonElement;
		try {
			await navigator.clipboard.writeText(String(pluginId));
			button.textContent = 'Copied!';
			setTimeout(() => (button.textContent = 'Copy ID'), 1500);
		} catch (err) {
			button.textContent = 'Failed';
		}
	}
</script>

<svelte:head>
	<meta name="description" content="A list with the plugin ids of all your plugins." />
	<title>bStats - What is my plugin ID?</title>
</svelte:head>

<main class="pb-24">
	<PageHero>
		{#snippet badge()}<Badge>Account</Badge>{/snippet}
		{#snippet title()}Plugin IDs{/snippet}
		{#snippet content()}
			Every plugin registered with bStats has an ID. Use it when instantiating the Metrics class.
			Here's a quick way to copy them.
		{/snippet}
	</PageHero>

	{#if !data.loggedIn}
		<section class="doc-container mt-12">
			<div class="form-card space-y-4 text-center">
				<p class="text-sm text-slate-600">You need to be signed in to view your plugin IDs.</p>
				<Button href={resolve('/login')} fullWidth size="large">Log in</Button>
			</div>
		</section>
	{:else if data.myPlugins.length <= 0}
		<section class="doc-container mt-12 space-y-6">
			<div class="doc-card space-y-4 text-center">
				<h2 class="doc-card-title">No plugins yet</h2>
				<p class="text-sm text-slate-600">Once you add a plugin, we'll show its ID here.</p>
				<Button href={resolve('/add-plugin')} size="large">Add your first plugin</Button>
			</div>
			<div class="doc-card text-center">
				<p class="mb-4 text-sm text-slate-600">Until then, enjoy a random cat:</p>
				<img
					class="mx-auto w-full max-w-sm rounded-2xl border border-slate-200"
					src="https://cataas.com/cat?{Math.random()}"
					alt="Random cat"
					loading="lazy"
				/>
			</div>
		</section>
	{:else}
		<section class="doc-container mt-12 space-y-6">
			<div class="flex flex-col gap-3 sm:gap-2">
				<label class="input-label" for="pluginIdSearch">Filter plugins</label>
				<input
					id="pluginIdSearch"
					type="text"
					class="input-control"
					placeholder="Search by name or software"
					bind:value={searchValue}
				/>
			</div>
			<div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-slate-200 text-sm">
						<thead class="bg-slate-100 text-slate-500">
							<tr>
								<th class="px-4 py-3 text-left font-semibold tracking-[0.18em] uppercase">Plugin</th
								>
								<th class="px-4 py-3 text-left font-semibold tracking-[0.18em] uppercase"
									>Software</th
								>
								<th class="px-4 py-3 text-left font-semibold tracking-[0.18em] uppercase"
									>Plugin ID</th
								>
								<th class="px-4 py-3 text-right font-semibold tracking-[0.18em] uppercase"
									>Action</th
								>
							</tr>
						</thead>
						<tbody class="divide-y divide-slate-200 text-slate-700">
							{#each filteredPlugins as plugin}
								<tr class="transition-colors hover:bg-slate-50">
									<td class="px-4 py-3 font-semibold text-slate-900">{plugin.name}</td>
									<td class="px-4 py-3 text-slate-600">{plugin.software.name}</td>
									<td class="px-4 py-3 font-mono text-sm text-slate-800">{plugin.id}</td>
									<td class="px-4 py-3 text-right">
										<button
											type="button"
											class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:border-brand-200 hover:text-brand-600"
											onclick={(e) => copyToClipboard(plugin.id, e)}
										>
											Copy ID
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</section>
	{/if}
</main>
