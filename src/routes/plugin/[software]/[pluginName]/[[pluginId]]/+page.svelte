<script lang="ts">
	import { resolve } from '$app/paths';
	import Badge from '$lib/components/Badge.svelte';
	import Button from '$lib/components/Button.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();

	const formatter = new Intl.NumberFormat();

	let serversCurrent = $state('--');
	let serversRecord = $state('--');
	let playersCurrent = $state('--');
	let playersRecord = $state('--');

	onMount(() => {
		if (data.unknownPlugin) return;

		// Load flag CSS for maps
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = 'https://cloud.github.com/downloads/lafeber/world-flags-sprite/flags32.css';
		document.head.appendChild(link);

		// Set up global functions BEFORE loading charts.js
		(window as any).__bstatsCustomLayout = true;
		(window as any).getPluginId = () => data.plugin.id;
		(window as any).updatePlayersBadge = (chartData: any[]) => {
			if (!Array.isArray(chartData) || !chartData.length) return;
			const current = chartData[chartData.length - 1][1];
			const record = chartData.reduce((max: number, point: any) => Math.max(max, point[1]), 0);
			playersCurrent = formatter.format(current);
			playersRecord = formatter.format(record);
		};
		(window as any).updateServersBadge = (chartData: any[]) => {
			if (!Array.isArray(chartData) || !chartData.length) return;
			const current = chartData[chartData.length - 1][1];
			const record = chartData.reduce((max: number, point: any) => Math.max(max, point[1]), 0);
			serversCurrent = formatter.format(current);
			serversRecord = formatter.format(record);
		};

		// Load scripts sequentially to maintain dependencies
		const scripts = [
			'https://code.highcharts.com/stock/6.0.1/highstock.js',
			'https://code.highcharts.com/maps/6.0.1/modules/map.js',
			'https://code.highcharts.com/6.0.1/modules/exporting.js',
			'https://code.highcharts.com/6.0.1/modules/no-data-to-display.js',
			'https://code.highcharts.com/6.0.1/modules/drilldown.js',
			'https://code.highcharts.com/maps/6.0.1/modules/data.js',
			'https://code.highcharts.com/mapdata/custom/world.js',
			'/javascripts/charts/themes/chartTheme.js',
			'/javascripts/charts/charts.js'
		];

		function loadScriptSequentially(index: number) {
			if (index >= scripts.length) {
				initializeCharts();
				return;
			}

			const script = document.createElement('script');
			script.src = scripts[index];
			script.onload = () => {
				loadScriptSequentially(index + 1);
			};
			script.onerror = () => {
				console.error(`Failed to load script: ${scripts[index]}`);
				loadScriptSequentially(index + 1);
			};
			document.body.appendChild(script);
		}

		loadScriptSequentially(0);
	});

	function initializeCharts() {
		fetch(`/api/v1/plugins/${data.plugin.id}/charts`)
			.then((res) => res.json())
			.then((charts) => {
				const ids = Object.keys(charts).sort((a, b) => charts[a].position - charts[b].position);

				(window as any).__bstatsCharts = charts;

				const chartsContainer = document.getElementById('charts');
				if (!chartsContainer) return;

				ids.forEach((chartId) => {
					if (!charts.hasOwnProperty(chartId)) return;

					const chart = charts[chartId];
					const { card, suffix } = createChartCard(chartId, chart);
					chartsContainer.appendChild(card);
				});

				// Trigger chart rendering via existing charts.js
				const event = new CustomEvent('bstats:charts-shell-ready', { detail: charts });
				document.dispatchEvent(event);

				// Scroll to anchor if present
				if (window.location.hash) {
					const target = document.querySelector(window.location.hash);
					if (target) {
						setTimeout(() => {
							target.scrollIntoView({ behavior: 'smooth', block: 'start' });
						}, 800);
					}
				}
			});
	}

	function createChartCard(chartId: string, chart: any): { card: HTMLElement; suffix: string } {
		let colClass = 'col-span-1 min-w-0';
		let suffix = 'Pie';
		let height = '18rem';

		switch (chart.type) {
			case 'single_linechart':
				colClass = 'col-span-1 min-w-0 md:col-span-2';
				suffix = 'LineChart';
				height = '24rem';
				break;
			case 'simple_map':
			case 'advanced_map':
				colClass = 'col-span-1 min-w-0 md:col-span-2';
				suffix = 'Map';
				height = '30rem';
				break;
			case 'simple_bar':
			case 'advanced_bar':
				colClass = 'col-span-1 min-w-0 md:col-span-2';
				suffix = 'Bar';
				height = '24rem';
				break;
			default:
				colClass = 'col-span-1 min-w-0';
				suffix = 'Pie';
				height = '18rem';
		}

		const card = document.createElement('article');
		card.id = chartId;
		card.className = `${colClass} rounded-2xl border border-slate-200 bg-white shadow-sm`;

		const header = document.createElement('div');
		header.className = 'flex items-start justify-between gap-4 px-5 pt-5';

		const meta = document.createElement('div');
		meta.className = 'flex flex-col gap-2';

		const title = document.createElement('h3');
		title.className = 'font-display text-lg font-semibold text-slate-900';
		title.textContent = chart.title;
		meta.appendChild(title);
		header.appendChild(meta);

		const link = document.createElement('a');
		link.href = '#' + chartId;
		link.className =
			'inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-600';
		link.innerHTML = `<span>Permalink</span><svg class="h-4 w-4 text-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 4h7v7M11 13l9-9M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
		header.appendChild(link);

		const body = document.createElement('div');
		body.className = 'px-5 pb-6 pt-4';

		const surface = document.createElement('div');
		surface.className =
			'overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-2 sm:p-3 min-w-0';

		const container = document.createElement('div');
		container.id = chartId + suffix;
		container.className = 'w-full';
		container.style.minHeight = height;

		surface.appendChild(container);
		body.appendChild(surface);
		card.appendChild(header);
		card.appendChild(body);

		return { card, suffix };
	}
</script>

<svelte:head>
	{#if data.unknownPlugin}
		<meta name="description" content="We don't have stats about {data.pluginName}." />
		<title>bStats - Unknown plugin</title>
	{:else}
		<meta name="description" content="Some stats about {data.plugin.name}." />
		<title>bStats - {data.plugin.name}</title>
		<meta name="twitter:card" content="summary" />
		<meta name="twitter:site" content="@btobastian" />
		<meta name="twitter:title" content="{data.plugin.name} | bStats" />
		<meta name="twitter:description" content="Statistics about {data.plugin.name}!" />
		<meta name="twitter:image" content="https://bstats.org/images/Twitter.jpg" />
	{/if}
</svelte:head>

{#if data.unknownPlugin}
	<main>
		<PageHero>
			{#snippet badge()}<Badge type="error">Unknown plugin</Badge>{/snippet}
			{#snippet title()}We couldn't find it{/snippet}
			{#snippet content()}
				Sorry, we don't have any stats about
				<span class="font-semibold text-slate-900">{data.pluginName}</span>. Maybe it hasn't been
				registered yet or the name is spelled differently
			{/snippet}
			{#snippet extra()}
				<div class="mt-6 flex flex-wrap justify-center gap-3">
					<Button href={resolve('/plugin-list')}>Browse plugin list</Button>
					<a
						href={resolve('/add-plugin')}
						class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-brand-200 hover:text-brand-700"
					>
						Register plugin
					</a>
				</div>
			{/snippet}
		</PageHero>
	</main>
{:else}
	<main class="pb-24">
		<section
			class="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-brand-50 via-white to-sky-100"
		>
			<div
				class="absolute top-[-12rem] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-200/60 blur-3xl"
			></div>
			<div
				class="absolute top-1/2 right-[-10rem] h-80 w-80 -translate-y-1/2 rounded-full bg-sky-200/60 blur-3xl"
			></div>
			<div class="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
				<div class="flex flex-col gap-10 lg:flex-row lg:items-start">
					<div class="max-w-3xl">
						<Badge>{data.software.name}</Badge>
						<div class="mt-6 flex items-center gap-4">
							<h1
								class="font-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl"
							>
								{data.plugin.name}
							</h1>
							{#if data.isOwner}
								<a
									href={resolve(
										`/editPlugin/${data.software.url}/${data.plugin.name}/${data.plugin.id}`
									)}
									class="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
								>
									Edit
								</a>
							{/if}
						</div>
						<div class="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
							<span>
								by <a
									class="font-semibold text-brand-600 hover:text-brand-700"
									href={resolve(`/author/${data.plugin.owner}`)}>{data.plugin.owner}</a
								>
							</span>
							<span class="hidden h-1 w-1 rounded-full bg-slate-300 sm:inline-block"></span>
						</div>
					</div>
				</div>

				<div class="mt-12 grid gap-4 sm:grid-cols-2">
					<article class="min-w-0 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
						<span class="text-[11px] tracking-[0.25em] text-slate-500 uppercase">Servers</span>
						<div class="mt-4 flex items-baseline gap-2">
							<span id="serversCurrent" class="font-display text-4xl font-semibold text-slate-900"
								>{serversCurrent}</span
							>
							<span class="text-[11px] tracking-[0.2em] text-slate-500 uppercase">current</span>
						</div>
						<div
							class="mt-3 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500"
						>
							<span class="tracking-[0.18em] uppercase">record</span>
							<span id="serversRecord" class="font-semibold text-slate-600">{serversRecord}</span>
						</div>
					</article>
					<article class="min-w-0 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
						<span class="text-[11px] tracking-[0.25em] text-slate-500 uppercase">Players</span>
						<div class="mt-4 flex items-baseline gap-2">
							<span id="playersCurrent" class="font-display text-4xl font-semibold text-slate-900"
								>{playersCurrent}</span
							>
							<span class="text-[11px] tracking-[0.2em] text-slate-500 uppercase">current</span>
						</div>
						<div
							class="mt-3 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500"
						>
							<span class="tracking-[0.18em] uppercase">record</span>
							<span id="playersRecord" class="font-semibold text-slate-600">{playersRecord}</span>
						</div>
					</article>
				</div>
			</div>
		</section>

		<section class="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
			<div class="flex flex-col gap-3 sm:gap-2">
				<h2 class="font-display text-3xl font-semibold text-slate-900">Live charts</h2>
				<p class="text-sm text-slate-500">
					Hover, zoom, and drill into the data. Updated every 30 minutes.
				</p>
			</div>
			<div id="charts" class="mt-8 grid gap-8 md:grid-cols-2"></div>

			<div
				class="mt-14 rounded-3xl border border-slate-200 bg-white/80 p-6 text-sm text-slate-500 shadow-sm"
			>
				Charts powered by <a
					class="font-semibold text-brand-600 hover:text-brand-700"
					href="https://www.highcharts.com/"
					target="_blank"
					rel="noopener">Highcharts</a
				>
			</div>
		</section>
	</main>
{/if}
