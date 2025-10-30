<script lang="ts">
	import { resolve } from '$app/paths';
	import Badge from '$lib/components/Badge.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import { onMount } from 'svelte';

	let searchValue = $state('');
	let plugins = $state<any[]>([]);
	let filteredPlugins = $state<any[]>([]);
	let isLoading = $state(true);
	let hasError = $state(false);

	const formatter = new Intl.NumberFormat();

	function filterPlugins() {
		const query = searchValue.trim().toLowerCase();
		if (!query) {
			filteredPlugins = plugins;
			return;
		}
		filteredPlugins = plugins.filter((plugin) => {
			return (
				plugin.name.toLowerCase().includes(query) ||
				plugin.softwareName.toLowerCase().includes(query) ||
				plugin.ownerName.toLowerCase().includes(query)
			);
		});
	}

	onMount(() => {
		fetch('/api/v1/datatable')
			.then((response) => response.json())
			.then((data) => {
				plugins = data || [];
				plugins.sort((a, b) => (b.servers || 0) - (a.servers || 0));
				filteredPlugins = plugins;
				isLoading = false;
			})
			.catch(() => {
				hasError = true;
				isLoading = false;
			});
	});

	$effect(() => {
		filterPlugins();
	});
</script>

<svelte:head>
	<meta name="description" content="Browse plugins reporting to bStats." />
	<title>bStats - Plugin list</title>
</svelte:head>

<main class="pb-24">
	<PageHero>
		{#snippet badge()}<Badge>Directory</Badge>{/snippet}
		{#snippet title()}Plugin list{/snippet}
		{#snippet content()}
			Search thousands of plugins reporting metrics to bStats. Sort by servers, players, and
			software to spot what's trending.
		{/snippet}
	</PageHero>

	<section class="doc-container mt-12 space-y-6">
		<div class="grid gap-4 lg:flex lg:items-end lg:justify-between">
			<div class="input-group lg:w-80">
				<label class="input-label" for="pluginSearch">Search</label>
				<input
					id="pluginSearch"
					type="text"
					class="input-control"
					placeholder="Filter by name, owner, or software"
					bind:value={searchValue}
				/>
			</div>
			<div class="flex items-center gap-3 text-xs tracking-[0.2em] text-slate-500 uppercase">
				<span>
					{#if isLoading}
						&nbsp;
					{:else}
						{filteredPlugins.length}
						{filteredPlugins.length === 1 ? 'plugin' : 'plugins'}
					{/if}
				</span>
			</div>
		</div>

		<div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-slate-200 text-sm">
					<thead class="bg-slate-100 text-slate-500">
						<tr>
							<th class="px-4 py-3 text-left font-semibold tracking-[0.18em] uppercase">Name</th>
							<th class="px-4 py-3 text-left font-semibold tracking-[0.18em] uppercase">Software</th
							>
							<th class="px-4 py-3 text-left font-semibold tracking-[0.18em] uppercase">Owner</th>
							<th class="px-4 py-3 text-right font-semibold tracking-[0.18em] uppercase">Servers</th
							>
							<th class="px-4 py-3 text-right font-semibold tracking-[0.18em] uppercase">Players</th
							>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-200 text-slate-700">
						{#if isLoading}
							<tr>
								<td colspan="5" class="px-4 py-6 text-center text-sm text-slate-500"
									>Loading plugins…</td
								>
							</tr>
						{:else if hasError}
							<tr>
								<td colspan="5" class="px-4 py-6 text-center text-sm text-rose-600"
									>Failed to load plugins. Please try again later.</td
								>
							</tr>
						{:else if filteredPlugins.length === 0}
							<tr>
								<td colspan="5" class="px-4 py-6 text-center text-sm text-slate-500"
									>No plugins match your search.</td
								>
							</tr>
						{:else}
							{#each filteredPlugins as plugin}
								<tr class="transition-colors hover:bg-slate-50">
									<td class="px-4 py-3">
										<a
											href={resolve(
												`/plugin/${plugin.softwareUrl}/${plugin.name}/${plugin.pluginId}`
											)}
											class="font-semibold text-slate-900 hover:text-brand-600"
										>
											{plugin.name}
										</a>
									</td>
									<td class="px-4 py-3 text-slate-600">{plugin.softwareName}</td>
									<td class="px-4 py-3">
										<a
											href={resolve(`/author/${plugin.ownerName}`)}
											class="text-slate-600 hover:text-brand-600"
										>
											{plugin.ownerName}
										</a>
									</td>
									<td class="px-4 py-3 text-right font-semibold text-slate-900"
										>{formatter.format(plugin.servers || 0)}</td
									>
									<td class="px-4 py-3 text-right font-semibold text-slate-900"
										>{formatter.format(plugin.players || 0)}</td
									>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	</section>
</main>
