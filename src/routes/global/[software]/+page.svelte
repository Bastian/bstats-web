<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();

	onMount(() => {
		// Load flag CSS for maps
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = 'https://cloud.github.com/downloads/lafeber/world-flags-sprite/flags32.css';
		document.head.appendChild(link);

		// Set up global functions BEFORE loading charts.js
		(window as any).getPluginId = () => data.plugin.id;
		(window as any).updatePlayersBadge = (chartData: any[]) => {
			const current = chartData[chartData.length - 1][1];
			let record = 0;
			for (let i = 0; i < chartData.length; i++) {
				record = chartData[i][1] > record ? chartData[i][1] : record;
			}
			const badge = document.getElementById('playersBadge');
			if (badge) {
				badge.innerHTML = `Players (Current/Record): ${current} / ${record}`;
			}
		};
		(window as any).updateServersBadge = (chartData: any[]) => {
			const current = chartData[chartData.length - 1][1];
			let record = 0;
			for (let i = 0; i < chartData.length; i++) {
				record = chartData[i][1] > record ? chartData[i][1] : record;
			}
			const badge = document.getElementById('serversBadge');
			if (badge) {
				badge.innerHTML = `Servers (Current/Record): ${current} / ${record}`;
			}
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
				// Load next script
				loadScriptSequentially(index + 1);
			};
			script.onerror = () => {
				console.error(`Failed to load script: ${scripts[index]}`);
				// Continue loading next script even if one fails
				loadScriptSequentially(index + 1);
			};
			document.body.appendChild(script);
		}

		// Start loading scripts sequentially
		loadScriptSequentially(0);
	});

	function initializeCharts() {
		// Load and render charts
		fetch(`/api/v1/plugins/${data.plugin.id}/charts`)
			.then((res) => res.json())
			.then((charts) => {
				const chartIdsSorted = Object.keys(charts).sort(
					(a, b) => charts[a].position - charts[b].position
				);
				let previousRowWasFull = true;

				const chartsContainer = document.getElementById('charts');
				if (!chartsContainer) return;

				for (let i = 0; i < chartIdsSorted.length; i++) {
					const chartId = chartIdsSorted[i];
					if (!charts.hasOwnProperty(chartId)) continue;

					const chart = charts[chartId];

					let nextChartIsCompleteRow = true;
					if (chartIdsSorted.length > i + 1) {
						const nextChartId = chartIdsSorted[i + 1];
						if (charts.hasOwnProperty(nextChartId)) {
							const nextChart = charts[nextChartId];
							switch (nextChart.type) {
								case 'simple_pie':
								case 'advanced_pie':
								case 'drilldown_pie':
									nextChartIsCompleteRow = false;
									break;
								default:
									nextChartIsCompleteRow = true;
									break;
							}
						}
					}

					let colWidth = 's12 m12 l12 xl12';
					switch (chart.type) {
						case 'simple_pie':
						case 'advanced_pie':
						case 'drilldown_pie':
							if (previousRowWasFull && nextChartIsCompleteRow) {
								colWidth = 's12 m12 l12 xl12';
								previousRowWasFull = true;
							} else if (!previousRowWasFull) {
								colWidth = 's12 m6 l6 xl5';
								previousRowWasFull = true;
							} else if (!nextChartIsCompleteRow) {
								colWidth = 's12 m6 l6 xl5 offset-xl1';
								previousRowWasFull = false;
							}
							chartsContainer.innerHTML += `<div id="${chartId}" class="col ${colWidth}"><div id="${chartId}Pie" style="min-width: 310px; height: 400px; max-width: 600px; margin: 0 auto"></div></div>`;
							break;
						case 'single_linechart':
							chartsContainer.innerHTML += `<div id="${chartId}" class="col s12"><div id="${chartId}LineChart" class="container" style="min-width: 310px; height: 400px; margin: 0 auto"></div><br><br></div>`;
							previousRowWasFull = true;
							break;
						case 'simple_map':
						case 'advanced_map':
							chartsContainer.innerHTML += `<div id="${chartId}" class="col s12"><div id="${chartId}Map" class="container" style="min-width: 310px; height: 600px; margin: 0 auto"></div><br><br></div>`;
							previousRowWasFull = true;
							break;
						case 'simple_bar':
						case 'advanced_bar':
							chartsContainer.innerHTML += `<div id="${chartId}" class="col s12"><div id="${chartId}Bar" class="container" style="min-width: 310px; margin: 0 auto"></div><br><br></div>`;
							previousRowWasFull = true;
							break;
					}
				}

				// Scroll to anchor if present
				if (window.location.hash) {
					const target = document.querySelector(window.location.hash);
					if (target) {
						target.scrollIntoView({ behavior: 'smooth' });
					}
				}
			});
	}
</script>

<svelte:head>
	<title>bStats - Global {data.software.name} stats</title>
	<meta name="description" content="bStats global stats." />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@btobastian" />
	<meta name="twitter:title" content="bStats - Plugin Metrics made with <3" />
	<meta name="twitter:description" content="bStats collects data for plugin authors. It's free and easy to use!" />
	<meta name="twitter:image" content="https://bstats.org/images/Twitter.jpg" />
</svelte:head>

<main>
	<div class="section no-pad-bot" id="index-banner">
		<div class="container">
			<br /><br />
			<h1 class="header center {data.customColor1}-text truncate">Global stats</h1>
			<div class="row center">
				<h5 class="header col s12 light">
					Here are our fancy global stats for {data.software.name}
				</h5>
			</div>
		</div>
	</div>

	<div class="row">
		<div class="col s12 m6 l4 offset-l2">
			<div class="card-panel {data.customColor1}">
				<span class="white-text"
					><i class="material-icons left">storage</i><b id="serversBadge"
						>Servers (Current/Record): loading...</b
					></span
				>
			</div>
		</div>
		<div class="col s12 m6 l4">
			<div class="card-panel {data.customColor1}">
				<span class="white-text"
					><i class="material-icons left">people</i><b id="playersBadge"
						>Players (Current/Record): loading...</b
					></span
				>
			</div>
		</div>
	</div>
	<br /><br />

	<div id="charts" class="row">
		<!-- Charts get added dynamically using JavaScript -->
	</div>

	<div class="center">
		Charts powered by <a href="http://highcharts.com">Highcharts</a>
		<br />
		<br />
	</div>
</main>
