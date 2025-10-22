<script lang="ts">
	import { resolve } from '$app/paths';
	import Badge from '$lib/components/Badge.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let searchValue = $state('');
	let filteredPlugins = $derived(
		data.plugins.filter((plugin) => {
			const query = searchValue.trim().toLowerCase();
			if (!query) return true;
			return (
				plugin.name.toLowerCase().includes(query) ||
				plugin.software.name.toLowerCase().includes(query)
			);
		})
	);
</script>

<svelte:head>
	<meta
		name="description"
		content="bStats collects data for plugin authors. It's free and easy to use!"
	/>
	<title>bStats - {data.username}</title>
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@btobastian" />
	<meta name="twitter:title" content="{data.username} | bStats" />
	<meta name="twitter:description" content="Statistics about {data.username}!" />
	<meta name="twitter:image" content="https://bstats.org/images/Twitter.jpg" />
</svelte:head>

<main class="pb-24">
	<PageHero>
		{#snippet badge()}<Badge>Author</Badge>{/snippet}
		{#snippet title()}{data.username}{/snippet}
		{#snippet content()}
			All plugins maintained by {data.username}. Follow the links to inspect charts and adoption
			numbers.
		{/snippet}
	</PageHero>

	<section class="doc-container mt-12 space-y-6">
		<div class="flex flex-col gap-3 sm:gap-2">
			<label class="input-label" for="authorPluginSearch">Filter plugins</label>
			<input
				id="authorPluginSearch"
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
							<th class="px-4 py-3 text-left font-semibold tracking-[0.18em] uppercase">Name</th>
							<th class="px-4 py-3 text-left font-semibold tracking-[0.18em] uppercase">Software</th
							>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-200 text-slate-700">
						{#if filteredPlugins.length === 0}
							<tr>
								<td colspan="2" class="px-4 py-6 text-center text-sm text-slate-500"
									>No plugins {searchValue ? 'match your search' : 'yet'}.</td
								>
							</tr>
						{:else}
							{#each filteredPlugins as plugin}
								<tr class="transition-colors hover:bg-slate-50">
									<td class="px-4 py-3 font-semibold text-slate-900">
										<a
											class="hover:text-brand-600"
											href={resolve(`/plugin/${plugin.software.url}/${plugin.name}/${plugin.id}`)}
											>{plugin.name}</a
										>
									</td>
									<td class="px-4 py-3 text-slate-600">
										{#if plugin.software.globalPlugin}
											<a
												class="hover:text-brand-600"
												href={resolve(`/global/${plugin.software.url}`)}
											>
												{plugin.software.name}
											</a>
										{:else}
											{plugin.software.name}
										{/if}
									</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	</section>
</main>
