<script lang="ts">
    import { resolve } from '$app/paths';
    import Badge from '$lib/components/badge.svelte';
    import Button from '$lib/components/button.svelte';
    import PageHero from '$lib/components/page-hero.svelte';
    import IconArrowRight from '@tabler/icons-svelte/icons/arrow-right';
</script>

<svelte:head>
    <meta name="description" content="Documentation for bStats - plugin metrics made easy." />
    <title>bStats - Documentation</title>
</svelte:head>

<main class="pb-24">
    <PageHero>
        {#snippet badge()}<Badge>Documentation</Badge>{/snippet}
        {#snippet title()}Documentation{/snippet}
        {#snippet content()}
            bStats collects plugin metrics across all major Minecraft server platforms. Track server
            counts, version adoption, and custom metrics. Free to use, respects privacy, and
            integrates in minutes.
        {/snippet}
    </PageHero>

    <section class="doc-container mt-12 space-y-10">
        <div class="grid gap-6 md:grid-cols-2">
            <article class="doc-card space-y-4">
                <h2 class="doc-card-title">Add your plugin</h2>
                <p class="max-w-prose text-sm leading-relaxed text-slate-600">
                    Ready to start collecting metrics? Our step-by-step wizard will guide you
                    through registering your plugin and integrating the Metrics class into your
                    code.
                </p>
                <div class="mt-6">
                    <Button href={resolve('/add-plugin')} size="large">
                        Start the integration wizard
                        <IconArrowRight size={18} />
                    </Button>
                </div>
            </article>
            <article class="doc-card">
                <h2 class="doc-card-title">Custom charts</h2>
                <p class="mt-3 max-w-prose text-sm leading-relaxed text-slate-600">
                    Collect the signals your plugin needs with custom charts. Build pies, lines, and
                    bar charts to highlight your feature adoption, configuration choices, or usage
                    patterns.
                </p>
                <a
                    href={resolve('/docs/custom-charts')}
                    class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
                >
                    Learn more
                    <IconArrowRight size={18} />
                </a>
            </article>

            <article class="doc-card">
                <h2 class="doc-card-title">REST API</h2>
                <p class="mt-3 max-w-prose text-sm leading-relaxed text-slate-600">
                    Use the REST API to embed plugin metrics in your site or tooling. All endpoints
                    are read-only, return JSON, and require no authentication.
                </p>
                <a
                    href={resolve('/docs/rest-api')}
                    class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
                >
                    View API reference
                    <IconArrowRight size={18} />
                </a>
            </article>

            <article class="doc-card">
                <h2 class="doc-card-title">Troubleshooting</h2>
                <p class="mt-3 max-w-prose text-sm leading-relaxed text-slate-600">
                    Data not showing up? Learn how long it takes for metrics to appear and how to
                    verify your integration is working correctly.
                </p>
                <a
                    href={resolve('/docs/troubleshooting')}
                    class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
                >
                    View troubleshooting guide
                    <IconArrowRight size={18} />
                </a>
            </article>

            <article class="doc-card">
                <h2 class="doc-card-title">FAQ</h2>
                <p class="mt-3 max-w-prose text-sm leading-relaxed text-slate-600">
                    Answers to common questions about bStats, accounts, and the Metrics class. Still
                    curious? Reach out on Discord or open an issue on GitHub.
                </p>
                <a
                    href={resolve('/faq')}
                    class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
                >
                    View frequently asked questions
                    <IconArrowRight size={18} />
                </a>
            </article>

            <article class="doc-card">
                <h2 class="doc-card-title">Server owners</h2>
                <p class="mt-3 max-w-prose text-sm leading-relaxed text-slate-600">
                    Running a Minecraft server? Learn what bStats collects, why it matters, and how
                    to manage your privacy preferences.
                </p>
                <a
                    href={resolve('/docs/server-owners')}
                    class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
                >
                    Information for server owners
                    <IconArrowRight size={18} />
                </a>
            </article>
        </div>
    </section>
</main>
