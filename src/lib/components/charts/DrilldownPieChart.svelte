<script lang="ts">
	import * as echarts from 'echarts';
	import { onMount, onDestroy } from 'svelte';
	import { getEChartsTheme } from '$lib/charts/echarts-theme';

	interface Props {
		data: {
			seriesData: { name: string; y: number; drilldown: string }[];
			drilldownData: { name: string; id: string; data: [string, number][] }[];
		};
	}

	let { data }: Props = $props();

	let chartContainer: HTMLDivElement;
	let chartInstance: echarts.ECharts | null = null;
	let isMobile = $state(false);
	let currentDrilldown = $state<string | null>(null);

	onMount(() => {
		isMobile = window.innerWidth <= 600;

		const handleResize = () => {
			isMobile = window.innerWidth <= 600;
			if (chartInstance) {
				chartInstance.resize();
			}
		};

		window.addEventListener('resize', handleResize);

		// Initialize chart
		chartInstance = echarts.init(chartContainer);
		updateChart();

		// Handle click events for drilldown
		chartInstance.on('click', (params) => {
			if (
				Array.isArray(params) ||
				!params.data ||
				typeof params.data !== 'object' ||
				!('drilldown' in params.data)
			) {
				return;
			}
			if (currentDrilldown === null && typeof params.data.drilldown === 'string') {
				currentDrilldown = params.data.drilldown;
				updateChart();
			}
		});

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	onDestroy(() => {
		if (chartInstance) {
			chartInstance.dispose();
			chartInstance = null;
		}
	});

	// Update chart when data or drilldown state changes
	$effect(() => {
		if (chartInstance && data) {
			updateChart();
		}
	});

	function updateChart() {
		if (!chartInstance || !data) return;

		const theme = getEChartsTheme();
		let chartData: { name: string; value: number; drilldown?: string }[] = [];

		if (currentDrilldown === null) {
			// Show top-level data
			chartData = data.seriesData
				.map((item) => ({
					name: item.name,
					value: item.y,
					drilldown: item.drilldown
				}))
				.sort((a, b) => b.value - a.value);
		} else {
			// Show drilled-down data
			const drilldownLevel = data.drilldownData.find((d) => d.id === currentDrilldown);
			if (drilldownLevel) {
				chartData = drilldownLevel.data
					.map(([name, value]) => ({
						name,
						value
					}))
					.sort((a, b) => b.value - a.value);
			} else {
				chartData = [];
			}
		}

		const option: echarts.EChartsOption = {
			color: theme.color,
			backgroundColor: theme.backgroundColor,
			textStyle: theme.textStyle,
			tooltip: {
				...theme.tooltip,
				trigger: 'item',
				formatter: (params) => {
					if (Array.isArray(params)) {
						params = params[0];
					}
					return `<strong>${params.name}</strong><br/>Share: ${params.percent}%<br/>Total: ${params.value}`;
				}
			},
			legend: isMobile
				? {
						orient: 'horizontal',
						bottom: 0,
						...theme.legend
					}
				: {
						show: false
					},
			series: [
				{
					type: 'pie',
					radius: '70%',
					data: chartData,
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					},
					label: {
						show: !isMobile,
						formatter: '{b}: {d}%',
						fontSize: 12
					}
				}
			]
		};

		chartInstance.setOption(option, true);
	}

	function goBack() {
		currentDrilldown = null;
		updateChart();
	}
</script>

<div class="relative h-72 w-full">
	<div bind:this={chartContainer} class="h-full w-full"></div>
	{#if currentDrilldown}
		<button
			onclick={goBack}
			class="absolute top-2 left-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-brand-300 hover:text-brand-700"
		>
			← Back
		</button>
	{:else}
		<div class="absolute top-2 right-0 left-0 text-center text-sm text-slate-500">
			Click the slices to view details
		</div>
	{/if}
</div>
