<script>
    import { resolve } from '$app/paths';
    import Badge from '$lib/components/badge.svelte';
    import PageHero from '$lib/components/page-hero.svelte';
    import { Accordion } from '$lib/components/accordion';
    import UsersGroup from '@tabler/icons-svelte/icons/users-group';
    import IconBattery4 from '@tabler/icons-svelte/icons/battery-4';
    import IconFreeRights from '@tabler/icons-svelte/icons/free-rights';
    import IconLabelImportant from '@tabler/icons-svelte/icons/label-important';
</script>

<svelte:head>
    <meta
        name="description"
        content="Information for Minecraft server owners about bStats metrics collection."
    />
    <title>bStats - Server owners</title>
</svelte:head>

<main class="pb-24">
    <PageHero>
        {#snippet badge()}<Badge>Documentation</Badge>{/snippet}
        {#snippet title()}For server owners{/snippet}
        {#snippet content()}
            Understanding bStats metrics collection, what data is shared, and how to manage your
            preferences.
        {/snippet}
    </PageHero>

    <section class="doc-container mt-12 space-y-10">
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
            <h2 class="doc-card-title">What is bStats?</h2>
            <p class="max-w-prose text-sm leading-relaxed text-slate-600">
                bStats is a free metrics service for Minecraft server plugins. When plugin authors
                integrate bStats into their plugins, they can see how many servers use their work,
                which Minecraft versions are popular, and how their plugins are configured.
            </p>
            <p class="max-w-prose text-sm leading-relaxed text-slate-600">
                As a server owner, your server automatically shares basic usage statistics with
                plugin authors when you install plugins that use bStats. This happens in the
                background and doesn't affect your server's performance. The data collected is
                anonymous and not linked to your individual server.
            </p>
        </article>

        <article class="doc-card space-y-4">
            <h2 class="doc-card-title">What data is collected?</h2>
            <p class="max-w-prose text-sm leading-relaxed text-slate-600">
                bStats collects only non-personal data and shows them as aggregated metrics. We
                never collect player names, chat logs, world data, or any personally identifiable
                information.
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
                            <span>Server location (country only)</span>
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
                        <UsersGroup size={24} class="text-brand-600" />
                        Supports the community
                    </h3>
                    <p class="mt-2 max-w-prose text-sm text-slate-600">
                        Many plugin authors maintain their plugins for free. Metrics provide a
                        tangible way to show appreciation and validate the time they invest in the
                        community.
                    </p>
                </div>
                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                    <h3 class="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <IconLabelImportant size={24} class="text-brand-600" />
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
                        <IconFreeRights size={24} class="text-brand-600" />
                        Privacy-first and community-run
                    </h3>
                    <p class="mt-2 max-w-prose text-sm text-slate-600">
                        bStats is open source and run by volunteers, not a company. It collects only
                        minimal, anonymous data, and the code is public so you can verify exactly
                        what's shared.
                    </p>
                </div>
                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                    <h3 class="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <IconBattery4 size={24} class="text-brand-600" />
                        Motivates developers
                    </h3>
                    <p class="mt-2 max-w-prose text-sm text-slate-600">
                        Seeing real usage statistics encourages plugin authors to continue
                        maintaining and improving their plugins. It's incredibly motivating to see
                        other people actually using your work.
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
                        Navigate to your server directory and find the bStats configuration file
                        usually at:
                    </p>
                    <code
                        class="mt-2 block rounded-lg bg-slate-900 px-4 py-3 font-mono text-sm text-slate-100"
                    >
                        /plugins/bStats/config.yml
                    </code>
                    <span class="text-xs text-slate-500">
                        Location might differ depending on server platform.
                    </span>
                </div>
                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                    <h3 class="text-sm font-semibold text-slate-700">Step 2: Edit the config</h3>
                    <p class="mt-2 max-w-prose text-sm text-slate-600">
                        Open the file with any text editor and change
                        <code class="font-mono text-slate-700">enabled</code>
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
                    No one can identify your specific server. All data is aggregated and displayed
                    as charts showing overall trends.
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
