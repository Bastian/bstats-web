<script>
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
    import Badge from '$lib/components/badge.svelte';
    import PageHero from '$lib/components/page-hero.svelte';
    import { Accordion } from '$lib/components/accordion';
    import { MetaTags } from 'svelte-meta-tags';
    import { getCanonicalUrl } from '$lib/utils/url';
</script>

<MetaTags
    title="Frequently Asked Questions - bStats"
    description="Answers to common questions about bStats, accounts, and the Metrics class."
    openGraph={{
        title: 'Frequently Asked Questions',
        description: 'Answers to common questions about bStats, accounts, and the Metrics class.',
        type: 'website',
        url: getCanonicalUrl(page.url),
        siteName: 'bStats',
        locale: 'en_US'
    }}
/>

<main class="pb-24">
    <PageHero>
        {#snippet badge()}<Badge>Help</Badge>{/snippet}
        {#snippet title()}Frequently asked questions{/snippet}
        {#snippet content()}
            Answers to common questions about bStats, accounts, and the Metrics class. Still
            curious? Reach out on
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
            <h2 class="doc-card-title">General</h2>
            <Accordion.Root class="space-y-3">
                <Accordion.Item title="Will bStats stay free?" contentClass="max-w-prose">
                    bStats has no plans to charge for existing features. Thanks to our sponsor
                    <a
                        class="font-semibold text-brand-600 hover:text-brand-700"
                        href={resolve('/credits')}
                    >
                        GameHosting
                    </a>
                    the platform runs without subscription income. Any future premium functionality would
                    be optional.
                </Accordion.Item>
                <Accordion.Item
                    title="Why isn't there a &quot;Universal&quot; category?"
                    contentClass="max-w-prose"
                >
                    Mixing Bukkit, BungeeCord, Hytale, and more in a single bucket would double-count
                    players and break comparisons. Separate categories keep charts accurate and easy
                    to read.
                </Accordion.Item>
                <Accordion.Item title="Is there an API?" contentClass="max-w-prose">
                    Yes. bStats exposes a lightweight REST API for public metrics. Start here:
                    <a
                        class="font-semibold text-brand-600 hover:text-brand-700"
                        href={resolve('/docs/rest-api')}
                    >
                        REST API documentation
                    </a>.
                </Accordion.Item>
            </Accordion.Root>
        </article>

        <article class="doc-card space-y-4">
            <h2 class="doc-card-title">Map charts</h2>
            <Accordion.Root class="space-y-3">
                <Accordion.Item
                    title="Why are certain borders displayed this way?"
                    contentClass="max-w-prose"
                >
                    Map data is provided by Natural Earth, and we follow <a
                        class="font-semibold text-brand-600 hover:text-brand-700"
                        href="https://www.naturalearthdata.com/about/disputed-boundaries-policy/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        their policy on disputed boundaries
                    </a>
                    to provide a neutral, de facto representation. While we recognize that all borders
                    are inherently political, our goal is to provide geographic context, not to take
                    a stance on territorial claims.
                </Accordion.Item>
            </Accordion.Root>
        </article>

        <article class="doc-card space-y-4">
            <h2 class="doc-card-title">Account</h2>
            <Accordion.Root class="space-y-3">
                <Accordion.Item title="How do I change my password?" contentClass="max-w-prose">
                    You can change your password on the
                    <a
                        class="font-semibold text-brand-600 hover:text-brand-700"
                        href={resolve('/change-password')}
                    >
                        change password page
                    </a>.
                </Accordion.Item>
                <Accordion.Item title="I forgot my password!" contentClass="max-w-prose">
                    Drop us a message on Discord or via GitHub Issues. We'll verify your ownership
                    and reset the account for you.
                </Accordion.Item>
            </Accordion.Root>
        </article>

        <article class="doc-card space-y-4">
            <h2 class="doc-card-title">Metrics class</h2>
            <Accordion.Root class="space-y-3">
                <Accordion.Item
                    title="How do I add bStats to my plugin?"
                    contentClass="max-w-prose"
                >
                    Head over to the
                    <a
                        class="font-semibold text-brand-600 hover:text-brand-700"
                        href={resolve('/add-plugin')}
                    >
                        integration wizard
                    </a>
                    for Maven and manual instructions.
                </Accordion.Item>
                <Accordion.Item
                    title="Where do I report bugs or request features?"
                    contentClass="max-w-prose"
                >
                    Website feedback lives on
                    <a
                        class="font-semibold text-brand-600 hover:text-brand-700"
                        href="https://github.com/Bastian/bStats/issues"
                    >
                        the bStats GitHub
                    </a>. Metrics class improvements belong on
                    <a
                        class="font-semibold text-brand-600 hover:text-brand-700"
                        href="https://github.com/Bastian/bStats-Metrics/issues"
                    >
                        bStats-Metrics
                    </a>.
                </Accordion.Item>
            </Accordion.Root>
        </article>
    </section>
</main>
