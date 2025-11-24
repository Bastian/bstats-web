<script lang="ts">
    import { page } from '$app/state';
    import Badge from '$lib/components/badge.svelte';
    import CodeBlock from '$lib/components/code-block.svelte';
    import PageHero from '$lib/components/page-hero.svelte';
    import { MetaTags } from 'svelte-meta-tags';
    import { getCanonicalUrl } from '$lib/utils/url';
    import BarChart from '$lib/components/charts/bar-chart.svelte';
    import DrilldownPieChart from '$lib/components/charts/drilldown-pie-chart.svelte';
    import LineChart from '$lib/components/charts/line-chart.svelte';
    import PieChart from '$lib/components/charts/pie-chart.svelte';
    import codeAdvancedBarChart from './advanced-bar.txt?raw';
    import codeAdvancedPie from './advanced-pie.txt?raw';
    import codeDrilldownPie from './drilldown-pie.txt?raw';
    import codeMultiLine from './multi-line.txt?raw';
    import codeSimpleBarChart from './simple-bar.txt?raw';
    import codeSimplePie from './simple-pie.txt?raw';
    import codeSingleLine from './single-line.txt?raw';

    // Static example data for charts
    const pieData = [
        { name: 'English', y: 86 },
        { name: 'German', y: 14 },
        { name: 'Esperanto', y: 13 },
        { name: 'Spanish', y: 3 },
        { name: 'Latin', y: 7 },
        { name: 'Chinese', y: 4 },
        { name: 'Japanese', y: 2 },
        { name: 'Klingon', y: 5 }
    ];

    const drilldownPieData: {
        seriesData: { name: string; y: number; drilldown: string }[];
        drilldownData: { name: string; id: string; data: [string, number][] }[];
    } = {
        seriesData: [
            { name: 'Java 7', y: 15, drilldown: 'Java 7' },
            { name: 'Java 8', y: 45, drilldown: 'Java 8' },
            { name: 'Java 9', y: 8, drilldown: 'Java 9' },
            { name: 'Other', y: 32, drilldown: 'Other' }
        ],
        drilldownData: [
            {
                name: 'Java 7',
                id: 'Java 7',
                data: [
                    ['1.7.0_80', 8],
                    ['1.7.0_75', 5],
                    ['1.7.0_67', 2]
                ]
            },
            {
                name: 'Java 8',
                id: 'Java 8',
                data: [
                    ['1.8.0_291', 20],
                    ['1.8.0_265', 15],
                    ['1.8.0_202', 10]
                ]
            },
            {
                name: 'Java 9',
                id: 'Java 9',
                data: [
                    ['1.9.0_4', 5],
                    ['1.9.0_1', 3]
                ]
            },
            {
                name: 'Other',
                id: 'Other',
                data: [
                    ['11.0.12', 12],
                    ['17.0.2', 10],
                    ['16.0.1', 6],
                    ['13.0.2', 4]
                ]
            }
        ]
    };

    // Random-walk line chart data
    const lineData: [number, number][] = [];
    const now = Date.now();
    const points = 24 * 2 * 365 * 1; // 1 year of half-day intervals
    let value = 350; // starting value
    const drift = 0; // average daily change
    const volatility = 16; // max per point daily change

    for (let i = points; i >= 0; i--) {
        const step = drift + (Math.random() * 2 - 1) * volatility; // [-volatility, +volatility]
        value = Math.max(0, value + step); // keep non-negative
        lineData.push([now - (i * 86400000) / 48, Math.round(value)]);
    }

    const barData = [
        { name: 'Disabled', data: [1337, 226] },
        { name: 'Enabled', data: [123, 1234] }
    ];

    const barCategories = ['Feature A', 'Feature B'];
</script>

<MetaTags
    title="Custom charts - bStats"
    description="Learn how to integrate custom charts into your plugin."
    openGraph={{
        title: 'Custom charts',
        description: 'Learn how to integrate custom charts into your plugin.',
        type: 'website',
        url: getCanonicalUrl(page.url),
        siteName: 'bStats',
        locale: 'en_US'
    }}
/>

{#snippet Example(title: string, code: string)}
    <h3 class="mb-1.5 text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase">
        {title}
    </h3>
    <CodeBlock lang="java" {code} />
{/snippet}

<main class="pb-24">
    <PageHero>
        {#snippet badge()}<Badge>Documentation</Badge>{/snippet}
        {#snippet title()}Custom charts{/snippet}
        {#snippet content()}
            bStats ships a handful of chart types you can wire into your Metrics instance.
        {/snippet}
    </PageHero>

    <section class="doc-container mt-12 space-y-10">
        <article class="doc-card space-y-4">
            <h2 class="doc-card-title">Basics</h2>
            <p class="max-w-prose text-sm leading-relaxed text-slate-600">
                Adding a custom chart consists of two steps: provide the data in your plugin code
                and register the chart on the website.
            </p>
            <ol class="list-decimal space-y-2 pl-6 text-sm text-slate-600">
                <li>Navigate to your plugin page and click <strong>Edit</strong>.</li>
                <li>Add a new chart and assign the chart ID you use in code.</li>
            </ol>
        </article>

        <article class="doc-card space-y-6">
            <div class="space-y-3">
                <h2 class="doc-card-title">Pie charts</h2>
                <p class="max-w-prose text-sm leading-relaxed text-slate-600">
                    Great for categorical data such as configuration options Simple pies track one
                    value per server. Advanced pies let you collect multiple values per server.
                </p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
                <PieChart data={pieData} />
            </div>
            <div class="space-y-4">
                {@render Example('Simple pie', codeSimplePie)}
                {@render Example('Advanced pie', codeAdvancedPie)}
            </div>
        </article>

        <article class="doc-card space-y-6">
            <div class="space-y-3">
                <h2 class="doc-card-title">Drilldown pie</h2>
                <p class="max-w-prose text-sm leading-relaxed text-slate-600">
                    Ideal when you want to group categories and drill into details.
                </p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
                <DrilldownPieChart data={drilldownPieData} />
            </div>
            {@render Example('Drilldown pie', codeDrilldownPie)}
        </article>

        <article class="doc-card space-y-6">
            <div class="space-y-3">
                <h2 class="doc-card-title">Line charts</h2>
                <p class="max-w-prose text-sm leading-relaxed text-slate-600">
                    Track trends over time. Single line charts are perfect for players, servers, or
                    any value that has one sample per interval. Multi line charts let you compare
                    metrics side by side.
                </p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
                <LineChart data={lineData} lineName="Players" />
            </div>
            <div class="space-y-4">
                {@render Example('Single line chart', codeSingleLine)}
                {@render Example('Multi line chart', codeMultiLine)}
                <p class="text-sm text-slate-500 italic">
                    (Note: Multi line charts are still in development)
                </p>
            </div>
        </article>

        <article class="doc-card space-y-6">
            <div class="space-y-3">
                <h2 class="doc-card-title">Bar charts</h2>
                <p class="max-w-prose text-sm leading-relaxed text-slate-600">
                    Surface rankings or option adoption. Simple bar charts display a single value
                    per category. Advanced bar charts support multiple bars per category.
                </p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
                <BarChart data={barData} categories={barCategories} valueName="Servers" />
            </div>
            {@render Example('Simple bar chart', codeSimpleBarChart)}
            {@render Example('Advanced bar chart', codeAdvancedBarChart)}
        </article>
    </section>
</main>
