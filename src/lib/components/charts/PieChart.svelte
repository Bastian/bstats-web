<script lang="ts">
	import * as echarts from 'echarts';
	import { onMount, onDestroy } from 'svelte';
	import { getEChartsTheme } from '$lib/charts/echarts-theme';

	interface Props {
		data: { name: string; y: number }[];
	}

	let { data }: Props = $props();

	let chartContainer: HTMLDivElement;
	let chartInstance: echarts.ECharts | null = null;
	let isMobile = $state(false);

	// Detect mobile on mount and window resize
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

	// Update chart when data changes
	$effect(() => {
		if (chartInstance && data) {
			updateChart();
		}
	});

	function updateChart() {
		if (!chartInstance || !data) return;

		// Sort data by value descending
		const sortedData = [...data].sort((a, b) => b.y - a.y);

		const theme = getEChartsTheme();
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
					data: sortedData.map((item) => ({
						name: item.name,
						value: item.y
					})),
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
</script>

<div bind:this={chartContainer} class="h-72 w-full"></div>
