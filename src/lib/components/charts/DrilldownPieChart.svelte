<script lang="ts">
    import * as echarts from 'echarts';
    import { onMount, onDestroy } from 'svelte';
    import { getEChartsTheme } from '$lib/charts/echarts-theme';
    import { accessibilityPreferences } from '$lib/stores/accessibility';

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
        updateChart(accessibilityPreferences.current.showChartPatterns);

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
                updateChart(accessibilityPreferences.current.showChartPatterns);
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

    // Update chart when data, drilldown state, or accessibility preferences change
    $effect(() => {
        if (chartInstance && data) {
            updateChart(accessibilityPreferences.current.showChartPatterns);
        }
    });

    function updateChart(showPatterns: boolean) {
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

        // Names are considered long if the 75th percentile length exceeds 15 characters
        const nameLengths = chartData.map((item) => item.name.length).sort((a, b) => a - b);
        const index75 = Math.floor(nameLengths.length * 0.75);
        const namesAreLong = (nameLengths[index75] || 0) > 15;

        // Build a descriptive summary for screen readers
        let description: string;
        if (chartData.length === 0) {
            description = 'Drilldown pie chart. No data available.';
        } else if (currentDrilldown === null) {
            const total = chartData.reduce((sum, item) => sum + item.value, 0);
            const topItems = chartData.slice(0, 5);
            const itemsDescription = topItems
                .map((item) => {
                    const percentage = ((item.value / total) * 100).toFixed(1);
                    return `${item.name}: ${item.value} (${percentage}%)`;
                })
                .join(', ');

            const hasMore = chartData.length > 5;
            description = `Drilldown pie chart showing ${chartData.length} ${chartData.length === 1 ? 'category' : 'categories'}. Click on a slice to view details. Total: ${total}. ${hasMore ? 'Top categories: ' : 'Categories: '}${itemsDescription}${hasMore ? `, and ${chartData.length - 5} more` : ''}.`;
        } else {
            const drilldownLevel = data.drilldownData.find((d) => d.id === currentDrilldown);
            const parentName = drilldownLevel?.name || currentDrilldown;
            const total = chartData.reduce((sum, item) => sum + item.value, 0);
            const topItems = chartData.slice(0, 5);
            const itemsDescription = topItems
                .map((item) => {
                    const percentage = ((item.value / total) * 100).toFixed(1);
                    return `${item.name}: ${item.value} (${percentage}%)`;
                })
                .join(', ');

            const hasMore = chartData.length > 5;
            description = `Detailed view of ${parentName} showing ${chartData.length} ${chartData.length === 1 ? 'item' : 'items'}. Total: ${total}. ${hasMore ? 'Top items: ' : 'Items: '}${itemsDescription}${hasMore ? `, and ${chartData.length - 5} more` : ''}.`;
        }

        const option: echarts.EChartsOption = {
            color: theme.color,
            backgroundColor: theme.backgroundColor,
            textStyle: theme.textStyle,
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
                    radius: '65%',
                    data: chartData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    itemStyle: {
                        borderColor: `#fff`,
                        borderWidth: 1
                    },
                    label: {
                        show: !isMobile,
                        formatter: '{b}: {d}%',
                        fontSize: 12
                    },
                    labelLine: {
                        show: !isMobile,
                        // When names are long, make the lines shorter to reduce
                        // likelihood of label truncation
                        length: namesAreLong ? 10 : 15,
                        length2: namesAreLong ? 15 : 20
                    }
                }
            ]
        };

        chartInstance.setOption(option, true);
    }

    function goBack() {
        currentDrilldown = null;
        updateChart(accessibilityPreferences.current.showChartPatterns);
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
