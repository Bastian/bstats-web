<script lang="ts">
    import * as echarts from 'echarts';
    import { onMount, onDestroy } from 'svelte';
    import { getEChartsTheme } from '$lib/charts/echarts-theme';
    import { accessibilityPreferences } from '$lib/stores/accessibility';

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

    // Update chart when data or accessibility preferences change
    $effect(() => {
        if (chartInstance && data) {
            updateChart(accessibilityPreferences.current.showChartPatterns);
        }
    });

    function updateChart(showPatterns: boolean) {
        if (!chartInstance || !data) return;

        // Sort data by value descending
        const sortedData = [...data].sort((a, b) => b.y - a.y);

        // Names are considered long if the 75th percentile length exceeds 15 characters
        const nameLengths = sortedData.map((item) => item.name.length).sort((a, b) => a - b);
        const index75 = Math.floor(nameLengths.length * 0.75);
        const namesAreLong = (nameLengths[index75] || 0) > 15;

        // Build a descriptive summary for screen readers
        let description: string;
        if (sortedData.length === 0) {
            description = 'Pie chart showing distribution. No data available.';
        } else {
            const total = sortedData.reduce((sum, item) => sum + item.y, 0);
            const topItems = sortedData.slice(0, 5);
            const itemsDescription = topItems
                .map((item) => {
                    const percentage = ((item.y / total) * 100).toFixed(1);
                    return `${item.name}: ${item.y} (${percentage}%)`;
                })
                .join(', ');

            const hasMore = sortedData.length > 5;
            description = `Pie chart showing distribution across ${sortedData.length} ${sortedData.length === 1 ? 'category' : 'categories'}. Total: ${total}. ${hasMore ? 'Top categories: ' : 'Categories: '}${itemsDescription}${hasMore ? `, and ${sortedData.length - 5} more` : ''}.`;
        }

        const theme = getEChartsTheme();
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
                    radius: isMobile ? '60%' : '65%',
                    top: isMobile ? '-20%' : undefined,
                    data: sortedData.map((item) => ({
                        name: item.name,
                        value: item.y
                    })),
                    itemStyle: {
                        borderColor: `#fff`,
                        borderWidth: 1
                    },
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
</script>

<div bind:this={chartContainer} class="-mx-[1rem] h-80 w-[calc(100%+2rem)] sm:h-72"></div>
