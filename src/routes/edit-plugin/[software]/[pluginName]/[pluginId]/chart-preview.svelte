<script lang="ts">
    import type { BarChartData, ChartData } from '$lib/charts/chart-data';
    import ChartBody from '$lib/components/charts/chart-body.svelte';
    import ChartCard from '$lib/components/charts/chart-card.svelte';

    interface Props {
        chartType: string;
        chartTitle?: string;
        lineName?: string;
        valueName?: string;
        orientation?: 'horizontal' | 'vertical';
        barLabels?: string[];
    }

    let {
        chartType,
        chartTitle,
        lineName,
        valueName,
        orientation,
        barLabels = []
    }: Props = $props();

    // Some types look identical once rendered (e.g. simple and advanced pie);
    // what differs is the data the plugin sends, so spell that out.
    const TYPE_DESCRIPTIONS: Record<string, string> = {
        simple_pie: 'Each server reports one value. Slices count how many servers sent each value.',
        advanced_pie:
            'Each server can report several values, each with its own count. Slices add up the counts from all servers.',
        drilldown_pie:
            'Values are grouped into categories. Click a slice to see the values inside it.',
        single_linechart:
            'Each server reports one number. The line shows the total across all servers, every 30 minutes.',
        simple_bar:
            'Each server reports a number per category. Bars add them up across all servers.',
        advanced_bar:
            'Each server reports several numbers per category, one per bar. Bars add them up across all servers.'
    };

    const SLICES = ['Value A', 'Value B', 'Value C', 'Value D', 'Value E'];
    const SHARES = [41, 26, 17, 10, 6];

    // A month of half-hourly points with a daily rhythm and slow growth.
    // Deterministic so the preview doesn't jump around while typing.
    function sampleLine(): [number, number][] {
        const periodMs = 30 * 60 * 1000;
        const points = 30 * 48;
        const end = Math.floor(Date.now() / periodMs) * periodMs;
        return Array.from({ length: points }, (_, i) => {
            const daily = Math.sin((i / 48) * 2 * Math.PI);
            const noise = Math.sin(i * 12.9898) * 6;
            const value = 120 + i * 0.05 + daily * 35 + noise;
            return [end - (points - 1 - i) * periodMs, Math.round(value)];
        });
    }

    function sampleBars(barCount: number): BarChartData[] {
        return SLICES.map((name, i) => ({
            name,
            data: Array.from({ length: barCount }, (_, bar) =>
                Math.round(SHARES[i] * (1 - bar * 0.3) * 3)
            )
        }));
    }

    const sampleData = $derived.by((): ChartData | null => {
        switch (chartType) {
            case 'simple_pie':
            case 'advanced_pie':
                return SLICES.map((name, i) => ({ name, y: SHARES[i] * 3 }));
            case 'drilldown_pie':
                return {
                    seriesData: SLICES.slice(0, 3).map((name, i) => ({
                        name,
                        y: SHARES[i] * 3,
                        drilldown: name
                    })),
                    drilldownData: SLICES.slice(0, 3).map((name, i) => ({
                        name,
                        id: name,
                        data: [
                            [`${name}.1`, SHARES[i] * 2],
                            [`${name}.2`, SHARES[i]]
                        ]
                    }))
                };
            case 'single_linechart':
                return sampleLine();
            case 'simple_bar':
                return sampleBars(1);
            case 'advanced_bar':
                return sampleBars(Math.max(barLabels.length, 2));
            default:
                return null;
        }
    });

    // Same fallbacks as the form placeholders, so an empty field still previews sensibly.
    const chart = $derived({
        type: chartType,
        data: {
            lineName: lineName?.trim() || 'My line',
            valueName: valueName?.trim() ?? '',
            orientation,
            barLabels
        }
    });
</script>

{#if sampleData}
    <section aria-labelledby="add-chart-preview-heading" class="space-y-2">
        <div class="flex items-baseline justify-between gap-3">
            <h3
                id="add-chart-preview-heading"
                class="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
                Preview
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Sample data</p>
        </div>
        <ChartCard chartId="add-chart-preview" title={chartTitle?.trim() || 'My chart'}>
            <ChartBody {chart} data={sampleData} />
        </ChartCard>
        {#if TYPE_DESCRIPTIONS[chartType]}
            <p class="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {TYPE_DESCRIPTIONS[chartType]}
            </p>
        {/if}
    </section>
{/if}
