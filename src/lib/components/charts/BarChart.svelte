<script lang="ts">
	import * as echarts from 'echarts';
	import { onMount, onDestroy } from 'svelte';
	import { getEChartsTheme } from '$lib/charts/echarts-theme';

	interface Props {
		data: { name: string; data: number[] }[];
		categories: string[];
		valueName?: string;
	}

	let { data, categories, valueName = 'Value' }: Props = $props();

	let chartContainer: HTMLDivElement;
	let chartInstance: echarts.ECharts | null = null;

	// Calculate dynamic height based on data
	const chartHeight = $derived(() => {
		if (!data || !categories) return 400;
		const seriesCount = data.length;
		const categoryCount = categories.length;
		return categoryCount * seriesCount * (30 + seriesCount * 15) + 120;
	});

	onMount(() => {
		const handleResize = () => {
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
		if (!chartInstance || !data || !categories) return;

		const theme = getEChartsTheme();

		const option: echarts.EChartsOption = {
			...theme,
			tooltip: {
				...theme.tooltip,
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			legend: {
				orient: 'horizontal',
				top: 10,
				...theme.legend
			},
			grid: {
				left: '3%',
				right: '8%',
				bottom: '3%',
				top: 50,
				containLabel: true
			},
			xAxis: {
				type: 'value' as const,
				name: valueName,
				min: 0,
				axisLine: theme.xAxis?.axisLine,
				splitLine: theme.xAxis?.splitLine,
				axisLabel: theme.xAxis?.axisLabel,
				nameTextStyle: theme.xAxis?.nameTextStyle
			},
			yAxis: {
				type: 'category' as const,
				data: categories,
				axisLine: theme.yAxis?.axisLine,
				splitLine: theme.yAxis?.splitLine,
				axisLabel: theme.yAxis?.axisLabel,
				nameTextStyle: theme.yAxis?.nameTextStyle
			},
			series: data.map((series) => ({
				name: series.name,
				type: 'bar',
				data: series.data,
				label: {
					show: true,
					position: 'right',
					formatter: '{c}',
					fontSize: 11
				},
				barMaxWidth: 25
			}))
		};

		chartInstance.setOption(option, true);
	}
</script>

<div bind:this={chartContainer} class="w-full" style="height: {chartHeight()}px"></div>
