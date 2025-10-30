<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
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
		// Load flag CSS for maps
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = 'https://cloud.github.com/downloads/lafeber/world-flags-sprite/flags32.css';
		document.head.appendChild(link);

		// Set up global functions BEFORE loading charts.js
		(window as any).__bstatsCustomLayout = true;
		(window as any).getPluginId = () => data.plugin.id;
		(window as any).updatePlayersBadge = (chartData: any[]) => {
			const current = chartData[chartData.length - 1][1];
			const record = chartData.reduce((max: number, point: any) => Math.max(max, point[1]), 0);
			playersCurrent = formatter.format(current);
			playersRecord = formatter.format(record);
		};
		(window as any).updateServersBadge = (chartData: any[]) => {
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
				// All scripts loaded, now initialize charts
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

		const title = document.createElement('h3');
		title.className = 'font-display text-lg font-semibold text-slate-900';
		title.textContent = chart.title;

		const link = document.createElement('a');
		link.href = '#' + chartId;
		link.className =
			'inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-600';
		link.innerHTML = `<span>Permalink</span><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none"><path d="M13 4h7v7M11 13l9-9M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

		header.appendChild(title);
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
	<meta name="description" content="bStats global stats." />
	<title>bStats - Global {data.software.name} stats</title>
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@btobastian" />
	<meta name="twitter:title" content="bStats - Plugin Metrics made with <3" />
	<meta
		name="twitter:description"
		content="bStats collects data for plugin authors. It's free and easy to use!"
	/>
	<meta name="twitter:image" content="https://bstats.org/images/Twitter.jpg" />
</svelte:head>

<main class="pb-24">
	<PageHero>
		{#snippet badge()}<Badge>Global stats</Badge>{/snippet}
		{#snippet title()}{data.software.name} usage at scale{/snippet}
		{#snippet content()}
			Aggregated metrics across every plugin reporting through bStats on {data.software.name}.
		{/snippet}
		{#snippet extra()}
			<div class="grid gap-4 sm:w-80">
				<article
					class="min-w-0 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm"
				>
					<span class="text-[11px] tracking-[0.25em] text-slate-500 uppercase">Servers</span>
					<div class="mt-2 flex items-baseline gap-3">
						<span id="serversCurrent" class="font-display text-4xl font-semibold text-slate-900"
							>{serversCurrent}</span
						>
						<span class="text-[11px] tracking-[0.2em] text-slate-500 uppercase">current</span>
					</div>
					<div class="mt-2 text-xs tracking-[0.18em] text-slate-500 uppercase">Record</div>
					<div id="serversRecord" class="text-sm font-semibold text-slate-600">
						{serversRecord}
					</div>
				</article>
				<article
					class="min-w-0 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm"
				>
					<span class="text-[11px] tracking-[0.25em] text-slate-500 uppercase">Players</span>
					<div class="mt-2 flex items-baseline gap-3">
						<span id="playersCurrent" class="font-display text-4xl font-semibold text-slate-900"
							>{playersCurrent}</span
						>
						<span class="text-[11px] tracking-[0.2em] text-slate-500 uppercase">current</span>
					</div>
					<div class="mt-2 text-xs tracking-[0.18em] text-slate-500 uppercase">Record</div>
					<div id="playersRecord" class="text-sm font-semibold text-slate-600">
						{playersRecord}
					</div>
				</article>
			</div>
		{/snippet}
	</PageHero>

	<section class="doc-container mt-12 space-y-10">
		<div class="flex flex-col gap-3 sm:gap-2">
			<h2 class="font-display text-3xl font-semibold text-slate-900">Live charts</h2>
			<p class="text-sm text-slate-500">
				Hover, zoom, and drill into the metrics shaping the {data.software.name} ecosystem.
			</p>
		</div>
		<div id="charts" class="grid gap-8 md:grid-cols-2"></div>
		<div
			class="rounded-2xl border border-slate-200 bg-white/80 p-6 text-sm text-slate-500 shadow-sm"
		>
			Charts powered by <a
				class="font-semibold text-brand-600 hover:text-brand-700"
				href="https://www.highcharts.com/"
				target="_blank"
				rel="noopener">Highcharts</a
			>.
		</div>
	</section>
</main>
