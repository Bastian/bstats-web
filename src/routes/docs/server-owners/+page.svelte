<script>
    import { resolve } from '$app/paths';
    import Badge from '$lib/components/Badge.svelte';
    import PageHero from '$lib/components/PageHero.svelte';
    import { Accordion } from '$lib/components/accordion';
</script>

<svelte:head>
    <meta
        name="description"
        content="Information for Minecraft server owners about bStats metrics collection."
    />
    <title>bStats - Server Owners</title>
</svelte:head>

<main class="pb-24">
    <PageHero>
        {#snippet badge()}<Badge>Documentation</Badge>{/snippet}
        {#snippet title()}For Server Owners{/snippet}
        {#snippet content()}
            Understanding bStats metrics collection, what data is shared, and how to manage your
            preferences.
        {/snippet}
    </PageHero>

    <section class="doc-container mt-12 space-y-10">
        <article class="doc-card space-y-4">
            <h2 class="doc-card-title">What is bStats?</h2>
            <p class="max-w-prose text-sm leading-relaxed text-slate-600">
                bStats is a free metrics service for Minecraft server plugins. When plugin authors
                integrate bStats into their plugins, they can see how many servers use their work,
                which Minecraft versions are popular, and how their plugins are configured.
            </p>
            <p class="max-w-prose text-sm leading-relaxed text-slate-600">
                As a server owner, your server automatically shares basic usage statistics with
                plugin authors when you install plugins that use bStats. This happens in the
                background and doesn't affect your server's performance.
            </p>
        </article>

        <article class="doc-callout doc-callout-info">
            <div class="flex items-start gap-3">
                <svg
                    class="h-6 w-6 shrink-0 text-brand-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                </svg>
                <div>
                    <h2 class="text-sm font-semibold text-slate-800">
                        bStats is a free, open source hobby project
                    </h2>
                    <p class="mt-2 max-w-prose text-sm leading-relaxed text-slate-600">
                        bStats is run as a passion project. It's completely
                        <a
                            class="font-semibold text-brand-600 hover:text-brand-700"
                            href="https://github.com/Bastian/bStats"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            open source
                        </a>
                        and free to use. There's no company behind it, no paid plans, and no intention
                        to monetize your data.
                    </p>
                </div>
            </div>
        </article>

        <article class="doc-card space-y-4">
            <h2 class="doc-card-title">What data is collected?</h2>
            <p class="max-w-prose text-sm leading-relaxed text-slate-600">
                bStats collects only non-personal, aggregate metrics. We never collect player names,
                chat logs, world data, or any personally identifiable information.
            </p>
            <div class="mt-4 space-y-3">
                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                    <h3 class="text-sm font-semibold text-slate-700">Example of collected data</h3>
                    <ul class="mt-2 max-w-prose space-y-1 text-sm text-slate-600">
                        <li class="flex gap-2">
                            <span class="text-brand-600">•</span>
                            <span>Number of players currently online</span>
                        </li>
                        <li class="flex gap-2">
                            <span class="text-brand-600">•</span>
                            <span>Server software and version (e.g., Spigot 1.20.1)</span>
                        </li>
                        <li class="flex gap-2">
                            <span class="text-brand-600">•</span>
                            <span>Java version</span>
                        </li>
                        <li class="flex gap-2">
                            <span class="text-brand-600">•</span>
                            <span>Operating system type</span>
                        </li>
                        <li class="flex gap-2">
                            <span class="text-brand-600">•</span>
                            <span>Server location (country only, from IP geolocation)</span>
                        </li>
                    </ul>
                </div>
                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                    <h3 class="text-sm font-semibold text-slate-700">Plugin-specific data</h3>
                    <p class="mt-2 max-w-prose text-sm text-slate-600">
                        Some plugins collect custom metrics about how you use their features. For
                        example, a plugin might track which configuration options are most popular.
                        This helps authors understand which features to prioritize.
                    </p>
                </div>
            </div>
            <div class="doc-callout doc-callout-info mt-4">
                <p class="max-w-prose text-sm text-slate-600">
                    All collected data is public and can be viewed on each plugin's dashboard.
                </p>
            </div>
        </article>

        <article class="doc-card space-y-4">
            <h2 class="doc-card-title">Why keep metrics enabled?</h2>
            <p class="max-w-prose text-sm leading-relaxed text-slate-600">
                bStats helps the Minecraft server community in several ways:
            </p>
            <div class="mt-4 grid gap-4 md:grid-cols-2">
                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                    <h3 class="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <svg
                            class="h-5 w-5 text-brand-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        Motivates developers
                    </h3>
                    <p class="mt-2 max-w-prose text-sm text-slate-600">
                        Seeing real usage statistics encourages plugin authors to continue
                        maintaining and improving their plugins. It's incredibly motivating to see
                        thousands of servers using your work.
                    </p>
                </div>
                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                    <h3 class="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <svg
                            class="h-5 w-5 text-brand-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                        Guides development priorities
                    </h3>
                    <p class="mt-2 max-w-prose text-sm text-slate-600">
                        Authors can see which Minecraft versions are most popular, which features
                        are heavily used, and where to focus their development efforts. This leads
                        to better plugins for everyone.
                    </p>
                </div>
                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                    <h3 class="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <svg
                            class="h-5 w-5 text-brand-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        Identifies compatibility issues
                    </h3>
                    <p class="mt-2 max-w-prose text-sm text-slate-600">
                        By seeing which server versions and configurations are common, developers
                        can test and fix bugs more effectively, improving stability for your server.
                    </p>
                </div>
                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                    <h3 class="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <svg
                            class="h-5 w-5 text-brand-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        Supports the community
                    </h3>
                    <p class="mt-2 max-w-prose text-sm text-slate-600">
                        Many plugin authors maintain their plugins for free. Metrics provide a
                        tangible way to show appreciation and validate the time they invest in the
                        community.
                    </p>
                </div>
            </div>
        </article>

        <article class="doc-card space-y-4">
            <h2 class="doc-card-title">How to disable bStats</h2>
            <p class="max-w-prose text-sm leading-relaxed text-slate-600">
                We respect your choice if you prefer not to share metrics. You can disable bStats
                globally for all plugins on your server:
            </p>
            <div class="mt-4 space-y-4">
                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                    <h3 class="text-sm font-semibold text-slate-700">
                        Step 1: Locate the config file
                    </h3>
                    <p class="mt-2 max-w-prose text-sm text-slate-600">
                        Navigate to your server directory and find the bStats configuration file at:
                    </p>
                    <code
                        class="mt-2 block rounded-lg bg-slate-900 px-4 py-3 font-mono text-sm text-slate-100"
                    >
                        /plugins/bStats/config.yml
                    </code>
                </div>
                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                    <h3 class="text-sm font-semibold text-slate-700">Step 2: Edit the config</h3>
                    <p class="mt-2 max-w-prose text-sm text-slate-600">
                        Open the file with any text editor and change <code
                            class="font-mono text-slate-700">enabled</code
                        >
                        to <code class="font-mono text-slate-700">false</code>:
                    </p>
                    <pre
                        class="mt-2 overflow-x-auto rounded-lg bg-slate-900 px-4 py-3 font-mono text-sm text-slate-100"><code
                            >enabled: false</code
                        ></pre>
                </div>
            </div>
        </article>

        <article class="doc-card space-y-4">
            <h2 class="doc-card-title">Frequently asked questions</h2>
            <Accordion.Root class="space-y-3">
                <Accordion.Item
                    title="Does bStats affect server performance?"
                    contentClass="max-w-prose"
                >
                    No. bStats sends data asynchronously in the background and has negligible
                    performance impact. Data is sent once every 30 minutes, taking only a few
                    milliseconds.
                </Accordion.Item>

                <Accordion.Item
                    title="Can I view what data my server sends?"
                    contentClass="max-w-prose"
                >
                    <div class="space-y-4">
                        <p>
                            Yes. All bStats data is public. Visit any plugin's page on bStats to see
                            exactly what metrics are being collected and view the charts showing
                            aggregated data from all servers.
                        </p>
                        <p>
                            You can also enable debug logging in the bStats config file to see the
                            raw data your server sends.
                        </p>
                    </div>
                </Accordion.Item>

                <Accordion.Item title="Is bStats GDPR compliant?" contentClass="max-w-prose">
                    Yes. bStats doesn't collect any personally identifiable information. IP
                    addresses are used only for rate limiting and are never linked to any metrics
                    data. All data is anonymous and aggregated.
                </Accordion.Item>

                <Accordion.Item title="Who can see my server's data?" contentClass="max-w-prose">
                    No one can identify your specific server. All data is aggregated across
                    thousands of servers and displayed as charts showing overall trends. Individual
                    server data points are never exposed.
                </Accordion.Item>

                <Accordion.Item
                    title="Why do I see a bStats folder in my plugins directory?"
                    contentClass="max-w-prose"
                >
                    The <code class="font-mono text-slate-700">/plugins/bStats/</code> folder contains
                    the shared configuration file used by all plugins. This allows you to enable or disable
                    metrics globally instead of configuring each plugin individually.
                </Accordion.Item>
            </Accordion.Root>
        </article>

        <article class="doc-card space-y-4">
            <h2 class="doc-card-title">Learn more</h2>
            <p class="max-w-prose text-sm leading-relaxed text-slate-600">
                If you have questions or concerns about bStats, we're here to help:
            </p>
            <div class="mt-4 flex flex-wrap gap-4">
                <a
                    href={resolve('/docs')}
                    class="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
                >
                    View documentation
                </a>
                <a
                    href={resolve('/privacy-policy')}
                    class="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
                >
                    Privacy policy
                </a>
                <a
                    href="https://discord.gg/qTXtXuf"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
                >
                    Join Discord
                </a>
            </div>
        </article>
    </section>
</main>
