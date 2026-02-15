<script lang="ts">
    import * as echarts from 'echarts';
    import { onMount, onDestroy } from 'svelte';
    import { getEChartsTheme } from '$lib/charts/echarts-theme';
    import { accessibilityPreferences } from '$lib/stores/accessibility';
    import { isDark } from '$lib/stores/theme.svelte';

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
        updateChart(accessibilityPreferences.current.showChartPatterns);

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

    // Update chart when data, accessibility preferences, or theme change
    $effect(() => {
        void isDark.current;
        if (chartInstance && data) {
            updateChart(accessibilityPreferences.current.showChartPatterns);
        }
    });

    function updateChart(showPatterns: boolean) {
        if (!chartInstance || !data || !categories) return;

        const dark = isDark.current;
        const theme = getEChartsTheme(dark);

        // Build a descriptive summary for screen readers
        const seriesNames = data.map((s) => s.name).join(', ');
        const categoryList = categories.slice(0, 3).join(', ');
        const hasMore = categories.length > 3;

        // Add sample data points (first 2 categories)
        let dataDescription = '';
        const maxCategoriesToDescribe = Math.min(10, categories.length);
        for (let i = 0; i < maxCategoriesToDescribe; i++) {
            const categoryName = categories[i];
            const values = data.map((series) => `${series.name}: ${series.data[i]}`).join(', ');
            dataDescription += ` ${categoryName} has ${values}.`;
        }
        if (categories.length > maxCategoriesToDescribe) {
            dataDescription += ` And ${categories.length - maxCategoriesToDescribe} more categories.`;
        }

        const description = `Bar chart comparing ${valueName} across ${categories.length} categories${hasMore ? ` (${categoryList}, and ${categories.length - 3} more)` : `: ${categoryList}`}. Shows ${data.length} data series: ${seriesNames}.${dataDescription}`;

        const option: echarts.EChartsOption = {
            ...theme,
            aria: {
                enabled: true,
                decal: {
                    show: showPatterns
                },
                label: {
                    description: description
                }
            },
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
                    fontSize: 11,
                    color: dark ? '#cbd5e1' : undefined // slate-300 for dark mode
                },
                barMaxWidth: 25
            }))
        };

        chartInstance.setOption(option, true);
    }
</script>

<div bind:this={chartContainer} class="w-full" style="height: {chartHeight()}px"></div>
