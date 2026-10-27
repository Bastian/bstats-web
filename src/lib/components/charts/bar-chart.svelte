<script lang="ts">
    import * as echarts from 'echarts';
    import { onMount, onDestroy } from 'svelte';
    import { getEChartsTheme } from '$lib/charts/echarts-theme';
    import { accessibilityPreferences } from '$lib/stores/accessibility';
    import { isDark } from '$lib/stores/theme.svelte';

    type BarChartOrientation = 'horizontal' | 'vertical';

    interface Props {
        data: { name: string; data: number[] }[];
        categories: string[];
        valueName?: string;
        /**
         * `horizontal` grows bars to the right (the historical default),
         * `vertical` grows them upwards.
         */
        orientation?: BarChartOrientation;
    }

    let { data, categories, valueName = '', orientation = 'horizontal' }: Props = $props();

    let chartContainer: HTMLDivElement;
    let chartInstance: echarts.ECharts | null = null;

    // Measure the chart itself instead of the window: cards can be narrow on a
    // desktop (e.g. inside a sidebar or a two-column grid) and wide on a phone.
    let containerWidth = $state(0);
    let containerHeight = $state(0);

    const isVertical = $derived(orientation === 'vertical');
    const isNarrow = $derived(containerWidth > 0 && containerWidth < 640);

    // Vertical charts have limited horizontal space per bar. Rotate the
    // category labels once they would overlap. The estimate is deliberately
    // rough: it only decides between horizontal and 45° labels.
    const rotateCategoryLabels = $derived.by(() => {
        if (!isVertical) return false;
        if (isNarrow) return true;
        if (containerWidth === 0) return categories.length > 8;
        const longestLabel = categories.reduce(
            (max, category) => Math.max(max, category.length),
            0
        );
        const labelWidth = Math.max(24, longestLabel * 7);
        return categories.length * labelWidth > containerWidth * 0.85;
    });

    const chartHeight = $derived.by(() => {
        if (!data || !categories) return 400;
        if (isVertical) {
            // Vertical bars share a fixed height and get thinner instead of
            // taller as categories are added. Legends need a little more room.
            return data.length > 1 ? 420 : 360;
        }
        const seriesCount = data.length;
        const categoryCount = categories.length;
        return categoryCount * seriesCount * (30 + seriesCount * 15) + 120;
    });

    onMount(() => {
        // Initialize chart
        chartInstance = echarts.init(chartContainer);
        updateChart(accessibilityPreferences.current.showChartPatterns);
    });

    onDestroy(() => {
        if (chartInstance) {
            chartInstance.dispose();
            chartInstance = null;
        }
    });

    // Keep the canvas in sync with the card, not just with the window.
    $effect(() => {
        void containerWidth;
        void containerHeight;
        if (chartInstance) {
            chartInstance.resize();
        }
    });

    // Update chart when data, accessibility preferences, or theme change.
    // `rotateCategoryLabels` is a derived value, so this only rebuilds the
    // option when the label rotation actually needs to change.
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
        const vertical = isVertical;

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

        const description = `${vertical ? 'Vertical' : 'Horizontal'} bar chart comparing ${valueName || 'values'} across ${categories.length} categories${hasMore ? ` (${categoryList}, and ${categories.length - 3} more)` : `: ${categoryList}`}. Shows ${data.length} data series: ${seriesNames}.${dataDescription}`;

        const categoryAxis = vertical
            ? {
                  type: 'category' as const,
                  data: categories,
                  axisLine: theme.xAxis?.axisLine,
                  splitLine: theme.xAxis?.splitLine,
                  axisLabel: {
                      ...theme.xAxis?.axisLabel,
                      interval: 0,
                      rotate: rotateCategoryLabels ? 45 : 0,
                      hideOverlap: true,
                      width: 90,
                      overflow: 'truncate' as const
                  },
                  nameTextStyle: theme.xAxis?.nameTextStyle
              }
            : {
                  type: 'category' as const,
                  data: categories,
                  axisLine: theme.yAxis?.axisLine,
                  splitLine: theme.yAxis?.splitLine,
                  axisLabel: theme.yAxis?.axisLabel,
                  nameTextStyle: theme.yAxis?.nameTextStyle
              };

        const valueAxis = {
            type: 'value' as const,
            name: valueName,
            min: 0,
            axisLine: theme.yAxis?.axisLine,
            splitLine: theme.yAxis?.splitLine,
            axisLabel: theme.yAxis?.axisLabel,
            nameTextStyle: theme.yAxis?.nameTextStyle
        };

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
                // A single series has no meaningful legend (it would just show
                // "Series 1" / the value name), so hide it.
                show: data.length > 1,
                orient: 'horizontal',
                top: 10,
                ...theme.legend
            },
            grid: vertical
                ? {
                      left: '2%',
                      right: '4%',
                      bottom: '3%',
                      // Leave room for the legend and for the value axis name,
                      // which ECharts draws above the axis line.
                      top: data.length > 1 ? 64 : valueName ? 40 : 20,
                      containLabel: true
                  }
                : {
                      left: '3%',
                      right: '8%',
                      bottom: '3%',
                      top: data.length > 1 ? 50 : 20,
                      containLabel: true
                  },
            xAxis: vertical ? categoryAxis : valueAxis,
            yAxis: vertical ? valueAxis : categoryAxis,
            series: data.map((series) => ({
                name: series.name,
                type: 'bar',
                data: series.data,
                label: {
                    show: true,
                    position: vertical ? 'top' : 'right',
                    formatter: '{c}',
                    fontSize: 11,
                    color: dark ? '#cbd5e1' : undefined // slate-300 for dark mode
                },
                barMaxWidth: vertical ? 32 : 25
            }))
        };

        chartInstance.setOption(option, true);
    }
</script>

<div
    bind:this={chartContainer}
    bind:clientWidth={containerWidth}
    bind:clientHeight={containerHeight}
    class="w-full"
    style="height: {chartHeight}px"
></div>
