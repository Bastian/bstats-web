<script lang="ts">
    import * as echarts from 'echarts';
    import { onMount, onDestroy } from 'svelte';
    import { getEChartsTheme } from '$lib/charts/echarts-theme';
    import { Button } from 'bits-ui';
    import { accessibilityPreferences } from '$lib/stores/accessibility';

    interface Props {
        data: [number, number][]; // [timestamp, value][]
        lineName?: string;
        onLoadFullData?: () => void;
    }

    let { data, lineName = 'Value', onLoadFullData }: Props = $props();

    let chartContainer: HTMLDivElement;
    let chartInstance: echarts.ECharts | null = null;

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

    // Update chart when data or accessibility preferences change
    $effect(() => {
        if (chartInstance && data) {
            updateChart(accessibilityPreferences.current.showChartPatterns);
        }
    });

    function setTimeRange(range: string) {
        if (!chartInstance || !data) return;

        const firstDate = data.length > 0 ? data[0][0] : Date.now();
        const lastDate = data.length > 0 ? data[data.length - 1][0] : Date.now();

        // Data might be in reverse order, so find actual min/max
        const dataStart = Math.min(firstDate, lastDate);
        const dataEnd = Math.max(firstDate, lastDate);
        let start = dataStart;

        switch (range) {
            case '1d':
                start = Math.max(dataStart, dataEnd - 1 * 24 * 60 * 60 * 1000);
                break;
            case '1w':
                start = Math.max(dataStart, dataEnd - 7 * 24 * 60 * 60 * 1000);
                break;
            case '1m':
                start = Math.max(dataStart, dataEnd - 30 * 24 * 60 * 60 * 1000);
                break;
            case '3m':
                start = Math.max(dataStart, dataEnd - 90 * 24 * 60 * 60 * 1000);
                break;
            case '1y':
                start = Math.max(dataStart, dataEnd - 365 * 24 * 60 * 60 * 1000);
                break;
            case 'all':
                start = dataStart;
                break;
        }

        const startPercent =
            dataEnd - dataStart > 0 ? ((start - dataStart) / (dataEnd - dataStart)) * 100 : 0;

        // Update dataZoom using setOption
        chartInstance.setOption({
            dataZoom: [
                {
                    start: Math.max(0, startPercent),
                    end: 100
                },
                {
                    start: Math.max(0, startPercent),
                    end: 100
                }
            ]
        });
    }

    function resetZoom() {
        if (!chartInstance) return;
        chartInstance.dispatchAction({
            type: 'dataZoom',
            start: 0,
            end: 100
        });
    }

    function updateChart(showPatterns: boolean) {
        if (!chartInstance || !data) return;

        const theme = getEChartsTheme();

        // Calculate default zoom to show last month
        const now = Date.now();
        const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;
        const dataStart = data.length > 0 ? data[0][0] : now;
        const dataEnd = data.length > 0 ? data[data.length - 1][0] : now;

        // Calculate start percentage for dataZoom (default to last month)
        let startPercent = 0;
        if (dataEnd - dataStart > 0) {
            startPercent = Math.max(0, ((oneMonthAgo - dataStart) / (dataEnd - dataStart)) * 100);
        }

        // Build a descriptive summary for screen readers
        let description: string;
        if (data.length === 0) {
            description = `Line chart showing ${lineName} over time. No data available.`;
        } else {
            const latestValue = data[data.length - 1][1];
            const latestDate = new Date(data[data.length - 1][0]).toLocaleDateString();
            const firstValue = data[0][1];
            const firstDate = new Date(data[0][0]).toLocaleDateString();
            const change = latestValue - firstValue;
            const changeText =
                change > 0
                    ? `increased by ${change}`
                    : change < 0
                      ? `decreased by ${Math.abs(change)}`
                      : 'remained stable';

            description = `Line chart showing ${lineName} over time with ${data.length} data points from ${firstDate} to ${latestDate}. Initial value: ${firstValue}. Latest value: ${latestValue}. Overall trend: ${changeText}.`;
        }

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
                    type: 'cross'
                },
                formatter: (params) => {
                    if (!Array.isArray(params) || params.length === 0) return '';
                    const param = params[0];
                    if (!Array.isArray(param.value) || !param.value[0]) return '';
                    const date = new Date(param.value[0]).toLocaleDateString();
                    return `<strong>${date}</strong><br/>${lineName}: ${param.value[1]}`;
                }
            },
            toolbox: onLoadFullData
                ? {
                      feature: {
                          myLoadFullData: {
                              show: true,
                              title: 'Load full data',
                              icon: 'path://M512 128l256 256-256 256-45.248-45.248L666.752 512 466.752 173.248z M192 128l256 256-256 256-45.248-45.248L346.752 512 146.752 173.248z',
                              onclick: onLoadFullData
                          }
                      },
                      right: 20,
                      top: 10
                  }
                : undefined,
            grid: {
                left: '2%',
                right: '2%',
                top: '5%',
                bottom: '22%',
                containLabel: true
            },
            xAxis: {
                type: 'time' as const,
                axisLine: theme.xAxis?.axisLine,
                splitLine: theme.xAxis?.splitLine,
                axisLabel: theme.xAxis?.axisLabel,
                nameTextStyle: theme.xAxis?.nameTextStyle
            },
            yAxis: {
                type: 'value' as const,
                min: 0,
                axisLine: theme.yAxis?.axisLine,
                splitLine: theme.yAxis?.splitLine,
                nameTextStyle: theme.yAxis?.nameTextStyle,
                axisLabel: {
                    color: theme.yAxis?.axisLabel?.color,
                    fontSize: theme.yAxis?.axisLabel?.fontSize,
                    formatter: (value: number) => {
                        return value % 1 === 0 ? value.toString() : '';
                    }
                }
            },
            dataZoom: [
                {
                    type: 'slider',
                    start: startPercent,
                    end: 100,
                    height: 20,
                    bottom: 50,
                    textStyle: {
                        color: '#64748b'
                    },
                    handleStyle: {
                        color: '#10b981'
                    },
                    dataBackground: {
                        areaStyle: {
                            color: 'rgba(16, 185, 129, 0.2)'
                        },
                        lineStyle: {
                            color: '#10b981'
                        }
                    }
                },
                {
                    type: 'inside',
                    start: startPercent,
                    end: 100
                }
            ],
            series: [
                {
                    name: lineName,
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 4,
                    sampling: 'lttb',
                    itemStyle: {
                        color: '#10b981'
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgba(16, 185, 129, 0.3)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(16, 185, 129, 0.05)'
                            }
                        ])
                    },
                    data: data
                }
            ]
        };

        chartInstance.setOption(option, true);
    }
</script>

{#snippet ChartButton(label: string, props?: Button.RootProps)}
    <Button.Root
        {...props}
        class={[
            'rounded border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none',
            props?.class
        ]}
    >
        {label}
    </Button.Root>
{/snippet}

<div class="p-1 sm:p-2">
    <div class="relative mb-2 flex justify-center gap-1">
        {@render ChartButton('1d', { onclick: () => setTimeRange('1d') })}
        {@render ChartButton('1w', { onclick: () => setTimeRange('1w') })}
        {@render ChartButton('1m', { onclick: () => setTimeRange('1m') })}
        {@render ChartButton('3m', { onclick: () => setTimeRange('3m') })}
        {@render ChartButton('1y', { onclick: () => setTimeRange('1y') })}
        {@render ChartButton('All', { onclick: () => setTimeRange('all') })}
        {@render ChartButton('Reset', { onclick: resetZoom, class: 'absolute right-0' })}
    </div>
    <div bind:this={chartContainer} class="-mx-4 -mb-4 h-96 w-[calc(100%+2rem)]"></div>
</div>
