<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();

	let gistStylesheetLoaded = $state(false);

	// Function to load a gist via JSONP
	function loadGist(gistId: string, selector: string) {
		const callbackName = `gist_callback_${gistId.replace(/[^a-z0-9]/gi, '')}`;

		// Create global callback
		(window as any)[callbackName] = function (gistData: any) {
			// Load the stylesheet if not already loaded
			if (!gistStylesheetLoaded && gistData.stylesheet) {
				const link = document.createElement('link');
				link.rel = 'stylesheet';
				link.href = gistData.stylesheet;
				document.head.appendChild(link);
				gistStylesheetLoaded = true;
			}

			// Insert the HTML content
			const container = document.querySelector(selector) as HTMLElement;
			if (container) {
				container.innerHTML = gistData.div;
			}

			// Cleanup
			delete (window as any)[callbackName];
		};

		// Load script with JSONP callback
		const script = document.createElement('script');
		script.src = `https://gist.github.com/Bastian/${gistId}.json?callback=${callbackName}`;
		document.head.appendChild(script);
	}

	onMount(() => {
		// Load GitHub Gists via JSON API
		const gists = [
			{ id: '6ed19dae0322881af4f3dab87075397f', selector: '#gist-simple-pie' },
			{ id: 'b47279b4ff792153480b50ad0945c963', selector: '#gist-advanced-pie' },
			{ id: 'b35de0cfe951f2d7cacabf65762bfb3d', selector: '#gist-drilldown-pie' },
			{ id: 'ea8804db0479c539153f53f1561cc7d3', selector: '#gist-single-line' },
			{ id: '4445ea82bc921dfef82de90b535deb3e', selector: '#gist-multi-line' },
			{ id: '474cf7eb3c2997d3cab73e560dce0caa', selector: '#gist-bar-chart' }
		];

		gists.forEach(({ id, selector }) => {
			loadGist(id, selector);
		});

		// Define global functions required by charts.js
		(window as any).__bstatsCustomLayout = true;
		(window as any).getPluginId = function () {
			return '1';
		};
		(window as any).updatePlayersBadge = function () {};
		(window as any).updateServersBadge = function () {};

		// Load Highcharts scripts dynamically in sequential order
		const scripts = [
			'https://code.highcharts.com/stock/6.0.1/highstock.js',
			'https://code.highcharts.com/maps/6.0.1/modules/map.js',
			'https://code.highcharts.com/6.0.1/modules/exporting.js',
			'https://code.highcharts.com/6.0.1/modules/no-data-to-display.js',
			'https://code.highcharts.com/6.0.1/modules/drilldown.js',
			'/javascripts/charts/themes/chartTheme.js'
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
		if (typeof (window as any).Highcharts === 'undefined') {
			return;
		}

		const Highcharts = (window as any).Highcharts;

		// Pie chart example (Simple Pie)
		const pieData = [
			{
				name: 'Online',
				y: 86
			},
			{
				name: 'Offline',
				y: 14
			}
		];

		const pieContainer = document.getElementById('onlineModePie');
		if (pieContainer) {
			Highcharts.chart(pieContainer, {
				chart: { type: 'pie', backgroundColor: 'transparent' },
				title: { text: null },
				tooltip: { pointFormat: '<b>{point.percentage:.1f}%</b>' },
				plotOptions: {
					pie: {
						allowPointSelect: true,
						cursor: 'pointer',
						dataLabels: {
							enabled: true,
							format: '<b>{point.name}</b>: {point.percentage:.1f}%'
						}
					}
				},
				series: [
					{
						name: 'Mode',
						colorByPoint: true,
						data: pieData
					}
				]
			});
		}

		// Drilldown pie chart example
		const osPieContainer = document.getElementById('osPie');
		if (osPieContainer) {
			Highcharts.chart(osPieContainer, {
				chart: { type: 'pie', backgroundColor: 'transparent' },
				title: { text: null },
				tooltip: { pointFormat: '<b>{point.percentage:.1f}%</b>' },
				plotOptions: {
					pie: {
						allowPointSelect: true,
						cursor: 'pointer',
						dataLabels: {
							enabled: true,
							format: '<b>{point.name}</b>: {point.percentage:.1f}%'
						}
					}
				},
				series: [
					{
						name: 'OS Family',
						colorByPoint: true,
						data: [
							{
								name: 'Linux',
								y: 48,
								drilldown: 'Linux'
							},
							{
								name: 'Windows',
								y: 37,
								drilldown: 'Windows'
							},
							{
								name: 'macOS',
								y: 15,
								drilldown: 'macOS'
							}
						]
					}
				],
				drilldown: {
					series: [
						{
							id: 'Linux',
							data: [
								['Ubuntu', 20],
								['Debian', 12],
								['Other', 16]
							]
						},
						{
							id: 'Windows',
							data: [
								['Windows 11', 22],
								['Windows 10', 10],
								['Server', 5]
							]
						},
						{
							id: 'macOS',
							data: [
								['Ventura', 7],
								['Monterey', 5],
								['Other', 3]
							]
						}
					]
				}
			});
		}

		// Line chart example
		const lineContainer = document.getElementById('playersLineChart');
		if (lineContainer) {
			const lineData = [];
			const base = new Date().getTime();
			for (let i = 6; i >= 0; i--) {
				lineData.push([base - i * 86400000, Math.round(100 + Math.random() * 60)]);
			}

			Highcharts.stockChart(lineContainer, {
				chart: { backgroundColor: 'transparent' },
				rangeSelector: { selected: 1 },
				title: { text: null },
				series: [
					{
						name: 'Players',
						data: lineData
					}
				]
			});
		}

		// Bar chart example
		const barContainer = document.getElementById('exampleBar');
		if (barContainer) {
			const barData = {
				valueName: 'Servers',
				categories: ['Feature A', 'Feature B'],
				series: [
					{
						name: 'Disabled',
						data: [1337, 226]
					},
					{
						name: 'Enabled',
						data: [123, 1234]
					}
				]
			};

			Highcharts.chart(barContainer, {
				chart: {
					type: 'bar',
					backgroundColor: 'transparent',
					height: barData.categories.length * barData.series.length * 28 + 180
				},
				title: { text: null },
				tooltip: {
					headerFormat: '<span style="font-size: 14px"><b>{point.key}</b></span><br/>',
					pointFormat: '<b>{series.name}</b>: {point.y} ' + barData.valueName
				},
				legend: {
					align: 'left',
					verticalAlign: 'top'
				},
				xAxis: { categories: barData.categories },
				yAxis: { min: 0, title: { text: barData.valueName } },
				plotOptions: {
					bar: {
						dataLabels: {
							enabled: true
						}
					},
					series: {
						pointWidth: 25
					}
				},
				series: barData.series
			});
		}
	}
</script>

<svelte:head>
	<title>bStats - Custom Charts</title>
	<meta name="description" content="Examples for custom charts." />
</svelte:head>

<main class="pb-24">
	<PageHero>
		{#snippet badge()}<Badge>Documentation</Badge>{/snippet}
		{#snippet title()}Custom charts{/snippet}
		{#snippet content()}
			bStats ships a handful of chart types you can wire into your Metrics instance. Use these
			examples as a starting point for your own dashboards.
		{/snippet}
	</PageHero>

	<section class="doc-container mt-12 space-y-10">
		<article class="doc-card space-y-4">
			<h2 class="doc-card-title">Basics</h2>
			<p class="max-w-prose text-sm leading-relaxed text-slate-600">
				Adding a chart consists of two steps: provide the data in your plugin code and register the
				chart on the website.
			</p>
			<ol class="list-decimal space-y-2 pl-6 text-sm text-slate-600">
				<li>Navigate to your plugin page and click <strong>Edit</strong>.</li>
				<li>Add a new chart, pick a type, and assign the chart ID you use in code.</li>
			</ol>
			<div class="grid gap-4 md:grid-cols-2">
				<img
					class="rounded-2xl border border-slate-200"
					src="https://i.imgur.com/dhUF0zc.png"
					alt="Plugin edit button"
					loading="lazy"
				/>
				<img
					class="rounded-2xl border border-slate-200"
					src="https://i.imgur.com/DKbsXZ9.png"
					alt="Add chart dialog"
					loading="lazy"
				/>
			</div>
		</article>

		<article class="doc-card space-y-6">
			<div class="space-y-3">
				<h2 class="doc-card-title">Pie charts</h2>
				<p class="max-w-prose text-sm leading-relaxed text-slate-600">
					Great for categorical data such as configuration switches or version breakdowns. Simple
					pies track one value per server. Advanced pies let you combine multiple signals or apply
					weights.
				</p>
			</div>
			<div class="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
				<div id="onlineModePie" class="min-h-[320px] w-full"></div>
			</div>
			<div class="space-y-4">
				<h3 class="text-sm font-semibold tracking-[0.2em] text-slate-400 uppercase">
					Simple Pie example
				</h3>
				<div id="gist-simple-pie"></div>
				<h3 class="text-sm font-semibold tracking-[0.2em] text-slate-400 uppercase">
					Advanced Pie example
				</h3>
				<div id="gist-advanced-pie"></div>
			</div>
		</article>

		<article class="doc-card space-y-6">
			<div class="space-y-3">
				<h2 class="doc-card-title">Drilldown pie</h2>
				<p class="max-w-prose text-sm leading-relaxed text-slate-600">
					Ideal when you want to group categories and allow readers to dive deeper—for example, OS
					families followed by specific distributions.
				</p>
			</div>
			<div class="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
				<div id="osPie" class="min-h-[320px] w-full"></div>
			</div>
			<div id="gist-drilldown-pie"></div>
		</article>

		<article class="doc-card space-y-6">
			<div class="space-y-3">
				<h2 class="doc-card-title">Line charts</h2>
				<p class="max-w-prose text-sm leading-relaxed text-slate-600">
					Track trends over time. Single line charts are perfect for players, servers, or any value
					that has one sample per interval. Multi line charts let you compare metrics side by side.
				</p>
			</div>
			<div class="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
				<div id="playersLineChart" class="min-h-[320px] w-full"></div>
			</div>
			<div class="space-y-4">
				<h3 class="text-sm font-semibold tracking-[0.2em] text-slate-400 uppercase">
					Single Line Chart example
				</h3>
				<div id="gist-single-line"></div>
				<h3 class="text-sm font-semibold tracking-[0.2em] text-slate-400 uppercase">
					Multi Line Chart example
				</h3>
				<div id="gist-multi-line"></div>
				<p class="text-sm text-slate-500 italic">
					(Note: Multi Line Charts are still in development)
				</p>
			</div>
		</article>

		<article class="doc-card space-y-6">
			<div class="space-y-3">
				<h2 class="doc-card-title">Bar charts</h2>
				<p class="max-w-prose text-sm leading-relaxed text-slate-600">
					Surface rankings or option adoption. Simple bar charts display a single value per
					category. Advanced bar charts support multiple bars per category.
				</p>
			</div>
			<div class="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
				<div id="exampleBar" class="min-h-[320px] w-full"></div>
			</div>
			<div id="gist-bar-chart"></div>
		</article>
	</section>
</main>
