<script lang="ts">
    import * as echarts from 'echarts';
    import { onMount, onDestroy } from 'svelte';
    import { getEChartsTheme } from '$lib/charts/echarts-theme';
    import world110m from '$lib/assets/geo-json/world-110m.json';
    import { isDark } from '$lib/stores/theme.svelte';

    // Our backend returns ISO2 country codes, but our geoJSON has incomplete
    // ISO2 codes for countries with territories (e.g. France). So we need a
    // manual mapping for these cases.
    const ISO2_TO_A3: Record<string, string> = {
        FR: 'FRA',
        NO: 'NOR'
    };

    function mapIso2ToA3(iso2: string): string {
        if (ISO2_TO_A3[iso2]) {
            return ISO2_TO_A3[iso2];
        }
        // Fallback: Search in geoJSON properties
        const feature = world110m.features.find((f) => f.properties.ISO_A2 === iso2);
        return feature ? feature.properties.ADM0_A3_US : iso2;
    }

    // For the tooltip, we need a mapping from A3 to country name
    const A3_TO_NAME = world110m.features.reduce(
        (acc, feature) => {
            const a3 = feature.properties.ADM0_A3_US;
            const name = feature.properties.NAME;
            acc[a3] = name;
            return acc;
        },
        {} as Record<string, string>
    );

    interface Props {
        data: { code: string; value: number }[];
        valueName?: string;
    }

    let { data, valueName = 'Value' }: Props = $props();

    let chartContainer: HTMLDivElement;
    let chartInstance: echarts.ECharts | null = null;
    let mapLoaded = $state(false);

    onMount(() => {
        const handleResize = () => {
            if (chartInstance) {
                chartInstance.resize();
            }
        };

        window.addEventListener('resize', handleResize);

        loadWorldMap();

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

    // Update chart when data changes, map loads, or theme changes
    $effect(() => {
        void isDark.current;
        if (mapLoaded && chartInstance && data) {
            updateChart();
        }
    });

    async function loadWorldMap() {
        try {
            let geoJson = world110m;

            geoJson = {
                ...world110m,
                // Filter out Antarctica when it is not in the data
                // (Takes a lot of space in the map and is usually empty)
                features: data.find((d) => d.code === 'AQ')
                    ? world110m.features
                    : world110m.features.filter(
                          (feature) => feature.properties.NAME !== 'Antarctica'
                      )
            };

            // Register map with echarts
            echarts.registerMap('world', geoJson as never);

            // Initialize chart after map is loaded
            chartInstance = echarts.init(chartContainer);
            mapLoaded = true;
            updateChart();
        } catch (error) {
            console.error('Failed to load world map:', error);
        }
    }

    function updateChart() {
        if (!chartInstance || !data || !mapLoaded) return;

        const dark = isDark.current;
        const theme = getEChartsTheme(dark);

        // Calculate min and max for color scale
        const values = data.map((d) => d.value);
        const maxValue = Math.max(...values, 1);

        // Build a descriptive summary for screen readers
        let description: string;
        if (data.length === 0) {
            description = `World map showing ${valueName} distribution. No data available.`;
        } else {
            // Sort countries by value to show top contributors
            const sortedData = [...data].sort((a, b) => b.value - a.value);
            const topCountries = sortedData.slice(0, 5);
            const topCountriesDescription = topCountries
                .map((d) => {
                    const countryName = A3_TO_NAME[mapIso2ToA3(d.code)] || d.code;
                    return `${countryName}: ${d.value}`;
                })
                .join(', ');

            description = `World map showing ${valueName} distribution across ${data.length} ${data.length === 1 ? 'country' : 'countries'}. Top ${data.length === 1 ? 'country' : 'countries'} by ${valueName}: ${topCountriesDescription}.`;
        }

        const option: echarts.EChartsOption = {
            color: theme.color,
            backgroundColor: theme.backgroundColor,
            textStyle: theme.textStyle,
            aria: {
                enabled: true,
                label: {
                    description: description
                }
            },
            tooltip: {
                ...theme.tooltip,
                trigger: 'item',

                formatter: (params) => {
                    if (Array.isArray(params)) return '???';
                    const iso3 =
                        params.data && typeof params.data === 'object' && 'name' in params.data
                            ? params.data.name
                            : 'Unknown';
                    const value =
                        params.data && typeof params.data === 'object' && 'value' in params.data
                            ? params.data.value
                            : 0;
                    const countryName = A3_TO_NAME[String(iso3)] || 'Unknown';
                    return `<strong>${countryName}</strong><br/>${valueName}: ${value}`;
                }
            },
            visualMap: {
                min: 1,
                max: maxValue,
                text: ['High', 'Low'],
                realtime: false,
                calculable: true,
                inRange: {
                    color: dark
                        ? ['#4a2020', '#C62828', '#EF5350', '#FFCDD2']
                        : ['#FFCDD2', '#EF5350', '#C62828', '#B71C1C']
                },
                outOfRange: {
                    color: dark ? '#252732' : '#e2e8f0' // dark-700 / slate-200
                },
                textStyle: {
                    color: dark ? '#94a3b8' : '#475569' // slate-400 / slate-600
                },
                handleStyle: dark
                    ? {
                          color: '#94a3b8',
                          borderColor: '#64748b'
                      }
                    : undefined,
                left: 'left',
                bottom: 20
            },
            series: [
                {
                    name: valueName,
                    type: 'map',
                    map: 'world',
                    roam: true,
                    nameProperty: 'ADM0_A3_US',
                    itemStyle: {
                        areaColor: dark ? '#252732' : '#f1f5f9', // dark-700 / slate-100
                        borderColor: dark ? '#3b3c45' : '#cbd5e1' // dark-500 / slate-300
                    },
                    emphasis: {
                        label: {
                            show: true
                        },
                        itemStyle: {
                            areaColor: '#fca5a5'
                        }
                    },
                    data: data.map((d) => ({
                        name: mapIso2ToA3(d.code),
                        value: d.value
                    }))
                }
            ]
        };

        chartInstance.setOption(option, true);
    }

    function resetMap() {
        if (!chartInstance) return;
        chartInstance.dispatchAction({
            type: 'restore'
        });
    }
</script>

<div class="p-1 sm:p-2">
    <div class="relative -m-4 h-80 w-[calc(100%+2rem)] sm:h-[30rem]">
        <button
            onclick={resetMap}
            class="absolute top-4 right-4 z-10 rounded border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600 shadow-sm transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 dark:border-dark-600 dark:bg-dark-700 dark:text-slate-400 dark:hover:border-dark-500 dark:hover:bg-dark-600 dark:hover:text-slate-200"
            title="Reset zoom and position"
        >
            Reset
        </button>
        <div bind:this={chartContainer} class="h-full w-full"></div>
    </div>
</div>
