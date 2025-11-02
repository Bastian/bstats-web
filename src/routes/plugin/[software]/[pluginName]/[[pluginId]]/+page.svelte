<script lang="ts">
	import { resolve } from '$app/paths';
	import type {
		LineChartData,
		ChartMetadata,
		ChartData,
		BarChartData,
		SimplePieChartData,
		DrilldownPieChartData,
		MapChartData
	} from '$lib/charts/chart-data';
	import { fetchChartData, fetchCharts } from '$lib/charts/chart-data';
	import Badge from '$lib/components/Badge.svelte';
	import Button from '$lib/components/Button.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import ChartCard from '$lib/components/charts/ChartCard.svelte';
	import DrilldownPieChart from '$lib/components/charts/DrilldownPieChart.svelte';
	import LineChart from '$lib/components/charts/LineChart.svelte';
	import MapChart from '$lib/components/charts/MapChart.svelte';
	import PieChart from '$lib/components/charts/PieChart.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const formatter = new Intl.NumberFormat();

	let serversCurrent = $state('--');
	let serversRecord = $state('--');
	let playersCurrent = $state('--');
	let playersRecord = $state('--');

	let charts = $state<ChartMetadata[]>([]);
	let chartDataMap = $state<Record<number, ChartData>>({});

	onMount(() => {
		if (data.unknownPlugin) return;

		// Load flag CSS for maps
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = 'https://cloud.github.com/downloads/lafeber/world-flags-sprite/flags32.css';
		document.head.appendChild(link);

		// Fetch and initialize charts
		initializeCharts();
	});

	async function initializeCharts() {
		if (!data.plugin) return;

		try {
			// Fetch chart metadata
			const chartsData = await fetchCharts(data.plugin.id);
			const chartIds = Object.keys(chartsData).sort(
				(a, b) => chartsData[a].position - chartsData[b].position
			);

			// Build charts array with metadata
			charts = chartIds.map((id) => ({
				id,
				uid: chartsData[id].uid,
				type: chartsData[id].type,
				title: chartsData[id].title,
				position: chartsData[id].position,
				data: chartsData[id].data
			}));

			// Fetch data for each chart
			for (const chart of charts) {
				try {
					const maxElements = chart.type === 'single_linechart' ? 2 * 24 * 31 * 1 : undefined;
					const data = await fetchChartData(chart.uid, maxElements);
					chartDataMap[chart.uid] = data;

					// Update badges for special charts
					if (chart.id === 'players' && Array.isArray(data) && data.length > 0) {
						updatePlayersBadge(data as LineChartData);
					} else if (chart.id === 'servers' && Array.isArray(data) && data.length > 0) {
						updateServersBadge(data as LineChartData);
					}
				} catch (error) {
					console.error(`Failed to fetch data for chart ${chart.id}:`, error);
				}
			}

			// Scroll to anchor if present
			if (window.location.hash) {
				setTimeout(() => {
					const target = document.querySelector(window.location.hash);
					if (target) {
						target.scrollIntoView({ behavior: 'smooth', block: 'start' });
					}
				}, 800);
			}
		} catch (error) {
			console.error('Failed to initialize charts:', error);
		}
	}

	function updatePlayersBadge(chartData: LineChartData) {
		if (!Array.isArray(chartData) || !chartData.length) return;
		// Data is in reverse chronological order (newest first)
		const current = chartData[0][1];
		const record = chartData.reduce(
			(max: number, point: [number, number]) => Math.max(max, point[1]),
			0
		);
		playersCurrent = formatter.format(current);
		playersRecord = formatter.format(record);
	}

	function updateServersBadge(chartData: LineChartData) {
		if (!Array.isArray(chartData) || !chartData.length) return;
		// Data is in reverse chronological order (newest first)
		const current = chartData[0][1];
		const record = chartData.reduce(
			(max: number, point: [number, number]) => Math.max(max, point[1]),
			0
		);
		serversCurrent = formatter.format(current);
		serversRecord = formatter.format(record);
	}

	function getColSpan(chartType: string): 'single' | 'double' {
		switch (chartType) {
			case 'single_linechart':
			case 'simple_map':
			case 'advanced_map':
			case 'simple_bar':
			case 'advanced_bar':
				return 'double';
			default:
				return 'single';
		}
	}
</script>

<svelte:head>
	{#if data.unknownPlugin}
		<meta name="description" content="We don't have stats about {data.pluginName}." />
		<title>bStats - Unknown plugin</title>
	{:else}
		<meta name="description" content="Some stats about {data.plugin?.name}." />
		<title>bStats - {data.plugin?.name}</title>
		<meta name="twitter:card" content="summary" />
		<meta name="twitter:site" content="@btobastian" />
		<meta name="twitter:title" content="{data.plugin?.name} | bStats" />
		<meta name="twitter:description" content="Statistics about {data.plugin?.name}!" />
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
						<Badge>{data.software?.name}</Badge>
						<div class="mt-6 flex items-center gap-4">
							<h1
								class="font-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl"
							>
								{data.plugin?.name}
							</h1>
							{#if data.isOwner && data.plugin && data.software}
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
									href={resolve(`/author/${data.plugin?.owner}`)}>{data.plugin?.owner}</a
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
			<div class="mt-8 grid gap-8 md:grid-cols-2">
				{#each charts as chart (chart.id)}
					<ChartCard title={chart.title} chartId={chart.id} colSpan={getColSpan(chart.type)}>
						{#if chartDataMap[chart.uid]}
							{#if chart.type === 'simple_pie' || chart.type === 'advanced_pie'}
								<PieChart data={chartDataMap[chart.uid] as SimplePieChartData[]} />
							{:else if chart.type === 'drilldown_pie'}
								<DrilldownPieChart data={chartDataMap[chart.uid] as DrilldownPieChartData} />
							{:else if chart.type === 'single_linechart'}
								<LineChart
									data={chartDataMap[chart.uid] as LineChartData}
									lineName={chart.data?.lineName as string | undefined}
								/>
							{:else if chart.type === 'simple_bar' || chart.type === 'advanced_bar'}
								<BarChart
									data={chartDataMap[chart.uid] as BarChartData[]}
									categories={(chartDataMap[chart.uid] as BarChartData[])?.map(
										(d: BarChartData) => d.name
									) || []}
									valueName={chart.data?.valueName as string | undefined}
								/>
							{:else if chart.type === 'simple_map' || chart.type === 'advanced_map'}
								<MapChart
									data={chartDataMap[chart.uid] as MapChartData[]}
									valueName={chart.data?.valueName as string | undefined}
								/>
							{/if}
						{:else}
							<div class="flex h-72 items-center justify-center text-slate-500">
								Loading chart data...
							</div>
						{/if}
					</ChartCard>
				{/each}
			</div>
		</section>
	</main>
{/if}
