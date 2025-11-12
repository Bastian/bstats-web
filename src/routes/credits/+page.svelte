<script lang="ts">
    import Badge from '$lib/components/Badge.svelte';
    import PageHero from '$lib/components/PageHero.svelte';
    import IconExternalLink from '@tabler/icons-svelte/icons/external-link';
</script>

<svelte:head>
    <meta name="description" content="Acknowledgements and sponsors behind bStats." />
    <title>bStats - Credits</title>
</svelte:head>

<main class="pb-24">
    <PageHero>
        {#snippet badge()}<Badge>Credits</Badge>{/snippet}
        {#snippet title()}People and partners{/snippet}
        {#snippet content()}
            bStats runs on community contributions and infrastructure provided by our sponsor. Thank
            you for keeping the project going.
        {/snippet}
    </PageHero>

    {#snippet link(text: string, href: string)}
        <a
            {href}
            class="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
            target="_blank"
            rel="noopener"
        >
            {text}
            <IconExternalLink size={16} />
        </a>
    {/snippet}

    <section class="doc-container mt-16 space-y-12">
        <article class="doc-card">
            <div class="space-y-3">
                <Badge>Sponsor</Badge>
                <h2 class="font-display text-2xl font-semibold text-slate-900">GameHosting</h2>
                <p class="max-w-prose leading-relaxed text-slate-600">
                    GameHosting provides the resources that keep the platform online and free for
                    everyone. Their support makes it possible for developers worldwide to track and
                    analyze their plugin metrics without cost.
                </p>
                <div class="pt-2">
                    {@render link('Visit GameHosting', 'https://www.gamehosting.it/')}
                </div>
            </div>
        </article>

        <article class="doc-card">
            <div class="space-y-3">
                <Badge type="gray">Author</Badge>
                <h2 class="font-display text-2xl font-semibold text-slate-900">Bastian</h2>
                <p class="max-w-prose leading-relaxed text-slate-600">
                    Creator of the credits page. Also the creator and maintainer of bStats.
                </p>
                <div class="pt-2">
                    {@render link('GitHub profile', 'https://github.com/Bastian')}
                </div>
            </div>
        </article>

        <article class="doc-card">
            <div class="space-y-4">
                <Badge type="gray">Contributors</Badge>
                <h2 class="font-display text-2xl font-semibold text-slate-900">
                    Testers & friends
                </h2>
                <div class="space-y-3">
                    <div class="flex items-baseline gap-2">
                        <p class="font-medium text-slate-900">f_</p>
                        -
                        <p class="text-sm leading-relaxed text-slate-600">
                            Coined the name "bStats" and insisted to add a credits page.
                        </p>
                    </div>
                </div>
            </div>
        </article>
    </section>
</main>
