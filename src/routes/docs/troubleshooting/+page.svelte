<script>
    import Badge from '$lib/components/Badge.svelte';
    import Button from '$lib/components/Button.svelte';
    import PageHero from '$lib/components/PageHero.svelte';
    import { Accordion } from '$lib/components/accordion';
    import IconArrowRight from '@tabler/icons-svelte/icons/arrow-right';
</script>

<svelte:head>
    <meta name="description" content="Troubleshooting guide for bStats integration issues." />
    <title>bStats - Troubleshooting</title>
</svelte:head>

<main class="pb-24">
    <PageHero>
        {#snippet badge()}<Badge>Documentation</Badge>{/snippet}
        {#snippet title()}Troubleshooting{/snippet}
        {#snippet content()}
            Common issues and solutions for integrating bStats. If you're still stuck after reading
            this guide, reach out on
            <a
                class="font-semibold text-brand-600 hover:text-brand-700"
                href="https://discord.gg/qTXtXuf"
            >
                Discord
            </a>
            or open an issue on GitHub.
        {/snippet}
    </PageHero>

    <section class="doc-container mt-12 space-y-10">
        <article class="doc-card space-y-4">
            <h2 class="doc-card-title">How long until data appears?</h2>
            <p class="max-w-prose text-sm leading-relaxed text-slate-600">
                Understanding the timeline for when your data becomes visible on bStats:
            </p>
            <div class="space-y-3">
                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                    <h3 class="text-sm font-semibold text-slate-700">Initial delay</h3>
                    <p class="mt-2 max-w-prose text-sm leading-relaxed text-slate-600">
                        After the server starts, the first data is sent after a random
                        <strong>3-6 minute delay</strong>.
                    </p>
                </div>
                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                    <h3 class="text-sm font-semibold text-slate-700">Publication schedule</h3>
                    <p class="mt-2 max-w-prose text-sm leading-relaxed text-slate-600">
                        The bStats website publishes updates at <strong>hh:00 and hh:30</strong>
                        (every half hour). Once data is sent, it may take
                        <strong>up to 30 minutes</strong> to become visible on your plugin's dashboard.
                    </p>
                </div>
                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                    <h3 class="text-sm font-semibold text-slate-700">Total time</h3>
                    <p class="mt-2 max-w-prose text-sm leading-relaxed text-slate-600">
                        In total, expect to wait <strong>3-36 minutes</strong> after server startup before
                        seeing your first data point on the dashboard.
                    </p>
                </div>
            </div>
        </article>

        <article class="doc-card space-y-4">
            <h2 class="doc-card-title">Data not showing up</h2>
            <p class="max-w-prose text-sm leading-relaxed text-slate-600">
                If you've waited the expected time and still don't see any data, check these common
                issues:
            </p>
            <Accordion.Root class="space-y-3">
                <Accordion.Item title="Enable debug logging" contentClass="max-w-prose">
                    Enable debug logging in the bStats configuration file by setting
                    <code class="font-mono text-slate-700">logFailedRequests</code>,
                    <code class="font-mono text-slate-700">logSentData</code>, and
                    <code class="font-mono text-slate-700">logResponseStatusText</code> to
                    <code class="font-mono text-slate-700">true</code>.
                </Accordion.Item>

                <Accordion.Item title="Ratelimits" contentClass="max-w-prose">
                    Plugins are limited to sending data once per 30-minute interval (hh:00 and
                    hh:30). When you have debug logging enabled and see
                    <code class="font-mono text-slate-700">429 Too Many Requests</code> in the logs,
                    it means your plugin is being ratelimited.
                    <strong>This is completely normal</strong> and can be safely ignored.
                </Accordion.Item>

                <Accordion.Item title="Metrics class not instantiated" contentClass="max-w-prose">
                    Verify that you're actually creating an instance of the
                    <code class="font-mono text-slate-700">Metrics</code> class in your plugin's initialization
                    code. Simply including the class file isn't enough. You must instantiate it with
                    your plugin ID.
                </Accordion.Item>

                <Accordion.Item title="Wrong plugin ID" contentClass="max-w-prose">
                    Double-check that the plugin ID in your code matches the ID shown on your
                    plugin's dashboard.
                </Accordion.Item>

                <Accordion.Item title="Metrics disabled in config" contentClass="max-w-prose">
                    Server owners can disable bStats by editing. Check that
                    <code class="font-mono text-slate-700">enabled</code>
                    is set to
                    <code class="font-mono text-slate-700">true</code>.
                </Accordion.Item>

                <Accordion.Item title="Firewall or network blocking" contentClass="max-w-prose">
                    Ensure that your server can reach the bStats servers. A common issue is PiHole
                    or other ad-blocking software blocking the connection.
                </Accordion.Item>
            </Accordion.Root>
        </article>
        <article class="doc-card space-y-4">
            <h2 class="doc-card-title">Still having issues?</h2>
            <p class="max-w-prose text-sm leading-relaxed text-slate-600">
                If you've checked everything above and still can't see your data, please reach out
                for help:
            </p>
            <div class="mt-4 flex flex-wrap gap-3">
                <Button href="https://discord.gg/qTXtXuf" target="_blank" rel="noopener noreferrer">
                    Join Discord
                    <IconArrowRight size={18} />
                </Button>
                <a
                    href="https://github.com/Bastian/bStats/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
                >
                    Open GitHub Issue
                </a>
            </div>
        </article>
    </section>
</main>
