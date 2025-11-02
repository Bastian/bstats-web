<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import PieChart from '$lib/components/charts/PieChart.svelte';
	import DrilldownPieChart from '$lib/components/charts/DrilldownPieChart.svelte';
	import LineChart from '$lib/components/charts/LineChart.svelte';
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import { onMount } from 'svelte';

	let gistStylesheetLoaded = $state(false);

	// Static example data for charts
	const pieData = [
		{ name: 'Online', y: 86 },
		{ name: 'Offline', y: 14 }
	];

	const drilldownPieData: {
		seriesData: { name: string; y: number; drilldown: string }[];
		drilldownData: { name: string; id: string; data: [string, number][] }[];
	} = {
		seriesData: [
			{ name: 'Linux', y: 48, drilldown: 'Linux' },
			{ name: 'Windows', y: 37, drilldown: 'Windows' },
			{ name: 'macOS', y: 15, drilldown: 'macOS' }
		],
		drilldownData: [
			{
				name: 'Linux',
				id: 'Linux',
				data: [
					['Ubuntu', 20],
					['Debian', 12],
					['Other', 16]
				]
			},
			{
				name: 'Windows',
				id: 'Windows',
				data: [
					['Windows 11', 22],
					['Windows 10', 10],
					['Server', 5]
				]
			},
			{
				name: 'macOS',
				id: 'macOS',
				data: [
					['Ventura', 7],
					['Monterey', 5],
					['Other', 3]
				]
			}
		]
	};

	// Generate example line chart data for the last 7 days
	const lineData: [number, number][] = [];
	const base = new Date().getTime();
	for (let i = 6; i >= 0; i--) {
		lineData.push([base - i * 86400000, Math.round(100 + Math.random() * 60)]);
	}

	const barData = [
		{ name: 'Disabled', data: [1337, 226] },
		{ name: 'Enabled', data: [123, 1234] }
	];

	const barCategories = ['Feature A', 'Feature B'];

	interface GistData {
		stylesheet?: string;
		div: string;
	}

	// Function to load a gist via JSONP
	function loadGist(gistId: string, selector: string) {
		const callbackName = `gist_callback_${gistId.replace(/[^a-z0-9]/gi, '')}`;

		// Create global callback
		(window as unknown as Record<string, unknown>)[callbackName] = function (gistData: GistData) {
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
			delete (window as unknown as Record<string, unknown>)[callbackName];
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
	});
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
				<PieChart data={pieData} />
			</div>
			<div class="space-y-4">
				<h3 class="text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase">
					Simple Pie example
				</h3>
				<div id="gist-simple-pie"></div>
				<h3 class="text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase">
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
				<DrilldownPieChart data={drilldownPieData} />
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
				<LineChart data={lineData} lineName="Players" />
			</div>
			<div class="space-y-4">
				<h3 class="text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase">
					Single Line Chart example
				</h3>
				<div id="gist-single-line"></div>
				<h3 class="text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase">
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
				<BarChart data={barData} categories={barCategories} valueName="Servers" />
			</div>
			<div id="gist-bar-chart"></div>
		</article>
	</section>
</main>
