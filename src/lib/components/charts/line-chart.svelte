<script lang="ts">
    import * as echarts from 'echarts';
    import { onMount, onDestroy } from 'svelte';
    import { getEChartsTheme } from '$lib/charts/echarts-theme';
    import { Button } from 'bits-ui';
    import { accessibilityPreferences } from '$lib/stores/accessibility';

    interface Props {
        data: [number, number][]; // [timestamp, value][]
        lineName?: string;
    }

    let { data, lineName = 'Value' }: Props = $props();

    let chartContainer: HTMLDivElement;
    let chartInstance: echarts.ECharts | null = null;
    let isMobile = $state(false);

    const DEFAULT_ZOOM = '1m';

    let zoom = $state<string | null>(DEFAULT_ZOOM);

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
        setTimeRange(DEFAULT_ZOOM);

        chartInstance.on('dataZoom', () => {
            const option = chartInstance?.getOption();
            const dataZoom = option?.dataZoom as echarts.DataZoomComponentOption[];
            if (dataZoom && dataZoom.length > 0 && data) {
                const start = dataZoom[0].start ?? 0;
                const end = dataZoom[0].end ?? 100;

                // Detect which preset range this corresponds to
                const detectedRange = detectZoomRange(data, start, end);
                zoom = detectedRange;
            } else {
                zoom = null;
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

    // Update chart when data or accessibility preferences change
    $effect(() => {
        if (chartInstance && data) {
            updateChart(accessibilityPreferences.current.showChartPatterns);
            setTimeRange(DEFAULT_ZOOM);
        }
    });

    function detectZoomRange(
        data: [number, number][],
        startPercent: number,
        endPercent: number
    ): string | null {
        if (!data || data.length === 0) {
            return null;
        }

        if (startPercent <= 2.5 && endPercent >= 97.5) {
            return 'all';
        }

        const displayedRange = endPercent - startPercent;

        for (const preset of ['1d', '1w', '1m', '3m', '1y']) {
            const rangeMs = getRangeMilliseconds(preset);
            if (rangeMs === null) continue;

            // Get the expected range percentage for this preset
            const expected = calculateZoomPercentages(data, rangeMs);
            const expectedRange = expected.end - expected.start;

            // Calculate relative difference (as a percentage of the expected range)
            // E.g., if expected is 10% and displayed is 11%, that's a 10% relative difference
            const relativeDiff = Math.abs(expectedRange - displayedRange) / expectedRange;

            // Allow 10% relative tolerance
            const tolerance = 0.1;

            if (relativeDiff <= tolerance) {
                return preset;
            }
        }

        return null;
    }

    function calculateZoomPercentages(
        data: [number, number][],
        rangeMs: number | null
    ): { start: number; end: number } {
        if (!data || data.length === 0) {
            return { start: 0, end: 100 };
        }

        const firstDate = data[0][0];
        const lastDate = data[data.length - 1][0];
        const dataStart = Math.min(firstDate, lastDate);
        const dataEnd = Math.max(firstDate, lastDate);
        const totalRange = dataEnd - dataStart;

        if (rangeMs === null || totalRange === 0) {
            return { start: 0, end: 100 };
        }

        // If we have less data than the requested range, show all data
        if (rangeMs >= totalRange) {
            return { start: 0, end: 100 };
        }

        // Calculate how much of the data to show (from the end)
        const percentageToShow = (rangeMs / totalRange) * 100;
        return {
            start: Math.max(0, 100 - percentageToShow),
            end: 100
        };
    }

    function getRangeMilliseconds(range: string): number | null {
        switch (range) {
            case '1d':
                return 1 * 24 * 60 * 60 * 1000;
            case '1w':
                return 7 * 24 * 60 * 60 * 1000;
            case '1m':
                return 30 * 24 * 60 * 60 * 1000;
            case '3m':
                return 90 * 24 * 60 * 60 * 1000;
            case '1y':
                return 365 * 24 * 60 * 60 * 1000;
            case 'all':
                return null;
            default:
                return null;
        }
    }

    function setTimeRange(range: string) {
        if (!chartInstance || !data) return;

        // Get current zoom state
        const option = chartInstance.getOption();
        const currentDataZoom = option?.dataZoom as echarts.DataZoomComponentOption[];
        let currentEnd = 100;

        if (currentDataZoom && currentDataZoom.length > 0) {
            currentEnd = currentDataZoom[0].end ?? 100;
        }

        // Get the new range size
        const rangeMs = getRangeMilliseconds(range);
        const expectedPercentages = calculateZoomPercentages(data, rangeMs);
        const newRangeSize = expectedPercentages.end - expectedPercentages.start;

        // Try to preserve the right edge position
        let newEnd = currentEnd;
        let newStart = newEnd - newRangeSize;

        if (newStart < 0) {
            // Hit left edge, have to grow to the right
            newStart = 0;
            newEnd = Math.min(100, newRangeSize);
        }

        chartInstance.setOption({
            dataZoom: [
                {
                    start: newStart,
                    end: newEnd
                },
                {
                    start: newStart,
                    end: newEnd
                }
            ]
        });

        zoom = range;
    }

    function updateChart(showPatterns: boolean) {
        if (!chartInstance || !data) {
            return;
        }

        const theme = getEChartsTheme();

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
            legend: {
                show: false
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
                    inside: isMobile ? true : false,
                    // On mobile, use a darker color for better contrast because
                    // the labels are inside the chart area
                    color: isMobile ? '#222222' : theme.yAxis?.axisLabel?.color,
                    fontSize: theme.yAxis?.axisLabel?.fontSize,
                    formatter: (value: number) => {
                        return value % 1 === 0 ? value.toString() : '';
                    }
                }
            },
            dataZoom: [
                {
                    type: 'slider',
                    start: 0,
                    end: 100,
                    height: 30,
                    bottom: 40,
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
                    start: 0,
                    end: 100
                }
            ],
            series: [
                {
                    name: lineName,
                    type: 'line',
                    smooth: true,
                    showSymbol: false,
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
            {
                'bg-brand-50! font-medium! text-brand-700!': zoom === label
            },
            props?.class
        ]}
    >
        {label}
    </Button.Root>
{/snippet}

<div class="p-1 sm:p-2">
    <div class="mb-2 flex flex-wrap justify-center gap-1">
        {@render ChartButton('1d', { onclick: () => setTimeRange('1d') })}
        {@render ChartButton('1w', { onclick: () => setTimeRange('1w') })}
        {@render ChartButton('1m', { onclick: () => setTimeRange('1m') })}
        {@render ChartButton('3m', { onclick: () => setTimeRange('3m') })}
        {@render ChartButton('1y', { onclick: () => setTimeRange('1y') })}
        {@render ChartButton('All', { onclick: () => setTimeRange('all') })}
    </div>
    <div bind:this={chartContainer} class="-mb-8 h-96 w-full sm:-mx-4 sm:w-[calc(100%+2rem)]"></div>
</div>
