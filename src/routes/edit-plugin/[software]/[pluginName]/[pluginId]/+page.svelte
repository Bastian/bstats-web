<script lang="ts">
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
    import Badge from '$lib/components/badge.svelte';
    import Button from '$lib/components/button.svelte';
    import { MetaTags } from 'svelte-meta-tags';
    import { getCanonicalUrl } from '$lib/utils/url';
    import PageHero from '$lib/components/page-hero.svelte';
    import IconHelpCircle from '@tabler/icons-svelte/icons/help-circle';
    import type { PageData } from './$types';
    import AddChartForm from './add-chart-form.svelte';
    import ChartList from './chart-list.svelte';
    import DeletePluginForm from './delete-plugin-form.svelte';
    import TransferOwnershipForm from './transfer-ownership-form.svelte';

    let { data }: { data: PageData } = $props();
</script>

<MetaTags
    title="Edit {data.plugin.name} - bStats"
    description="Configure settings for your plugin {data.plugin.name}."
    openGraph={{
        title: `Edit ${data.plugin.name}`,
        description: `Configure settings for your plugin ${data.plugin.name}.`,
        type: 'website',
        url: getCanonicalUrl(page.url),
        siteName: 'bStats',
        locale: 'en_US'
    }}
/>

<main class="pb-24">
    {#if !data.canEdit}
        <PageHero>
            {#snippet badge()}<Badge type="error">Access denied</Badge>{/snippet}
            {#snippet title()}Nice try!{/snippet}
            {#snippet content()}
                Only the owner of
                <span class="font-semibold text-slate-900 dark:text-slate-100"
                    >{data.plugin.name}</span
                >
                can edit this plugin.
            {/snippet}
        </PageHero>
    {:else}
        <PageHero>
            {#snippet badge()}<Badge>Plugin</Badge>{/snippet}
            {#snippet title()}{data.plugin.name}{/snippet}
            {#snippet content()}
                Rename, hide and reorder the charts on your plugin page, or add your own.
            {/snippet}
            {#snippet extra()}
                <div class="flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <Button
                        href={resolve(
                            `/plugin/${data.softwareUrl}/${data.plugin.name}/${data.plugin.id}`
                        )}
                    >
                        View public page
                    </Button>
                    <span
                        class="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm dark:bg-dark-800/80 dark:text-slate-300"
                    >
                        <span class="h-2 w-2 rounded-full bg-brand-500"></span>
                        Owner: {data.plugin.owner}
                    </span>
                    <span
                        class="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm dark:bg-dark-800/80 dark:text-slate-300"
                    >
                        Plugin ID: {data.plugin.id}
                    </span>
                </div>
            {/snippet}
        </PageHero>

        <section class="doc-container mt-12 space-y-8">
            <div
                class="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
            >
                <div class="space-y-8">
                    <article class="doc-card space-y-6">
                        <div class="flex items-start justify-between gap-4">
                            <div>
                                <h2 class="doc-card-title">Add custom chart</h2>
                                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Show your own data, sent from your plugin's code.
                                </p>
                            </div>
                            <a
                                href={resolve('/docs/custom-charts')}
                                class="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500/70 focus-visible:outline-none dark:hover:bg-dark-700 dark:hover:text-brand-400"
                                aria-label="How custom charts work"
                                title="How custom charts work"
                            >
                                <IconHelpCircle size={20} />
                            </a>
                        </div>

                        <AddChartForm schema={data.addChartSchema} />
                    </article>

                    {#if data.user?.role === 'admin'}
                        <article class="doc-card space-y-4">
                            <div>
                                <h2 class="doc-card-title">Transfer ownership</h2>
                                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Move this plugin to a different user account
                                </p>
                            </div>

                            <TransferOwnershipForm schema={data.transferOwnershipSchema} />
                        </article>
                    {/if}
                </div>

                <article class="doc-card">
                    <ChartList {data} />
                </article>
            </div>

            <article
                class="doc-card grid grid-cols-1 items-center gap-6 border-red-200 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8 dark:border-red-900/60"
            >
                <div>
                    <h2 class="font-display text-xl font-semibold text-red-700 dark:text-red-400">
                        Delete plugin
                    </h2>
                    <p class="mt-1 max-w-prose text-sm text-slate-600 dark:text-slate-400">
                        Permanently deletes {data.plugin.name}, its charts and all collected data.
                        This can't be undone. To stop showing a single chart, hide it instead.
                    </p>
                </div>

                <DeletePluginForm schema={data.deletePluginSchema} plugin={data.plugin} />
            </article>
        </section>
    {/if}
</main>
