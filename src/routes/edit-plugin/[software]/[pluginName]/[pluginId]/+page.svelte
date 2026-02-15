<script lang="ts">
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
    import Badge from '$lib/components/badge.svelte';
    import Button from '$lib/components/button.svelte';
    import { MetaTags } from 'svelte-meta-tags';
    import { getCanonicalUrl } from '$lib/utils/url';
    import PageHero from '$lib/components/page-hero.svelte';
    import type { PageData } from './$types';
    import AddChartForm from './add-chart-form.svelte';
    import DeletePluginForm from './delete-plugin-form.svelte';
    import EditChartsForm from './edit-charts-form.svelte';
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
                Add custom charts, reorder existing ones, or delete this plugin.
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
            <div class="grid gap-8 lg:grid-cols-2">
                <!-- Add Chart Card -->
                <article class="doc-card space-y-6">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <h2
                                class="font-display text-xl font-semibold text-slate-900 dark:text-slate-100"
                            >
                                Add custom chart
                            </h2>
                            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Create a new chart to display on your plugin page
                            </p>
                        </div>
                        <a
                            href={resolve('/docs/custom-charts')}
                            class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800"
                            title="Help with custom charts"
                        >
                            <svg
                                class="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </a>
                    </div>

                    <AddChartForm schema={data.addChartSchema} />
                </article>

                <!-- Edit Charts Card -->
                <article class="doc-card space-y-4">
                    <div>
                        <h2
                            class="font-display text-xl font-semibold text-slate-900 dark:text-slate-100"
                        >
                            Edit charts
                        </h2>
                        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Drag to reorder, click to delete
                        </p>
                    </div>
                    <EditChartsForm {data} />
                </article>

                <!-- Delete Plugin Card -->
                <article class="doc-card space-y-4">
                    <div>
                        <h2
                            class="font-display text-xl font-semibold text-red-900 dark:text-red-400"
                        >
                            Delete plugin
                        </h2>
                        <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                            This action cannot be undone. All data will be permanently deleted.
                        </p>
                    </div>

                    <DeletePluginForm schema={data.deletePluginSchema} plugin={data.plugin} />
                </article>

                <!-- Transfer Ownership Card (Admin Only) -->
                {#if data.user?.role === 'admin'}
                    <article class="doc-card space-y-4">
                        <div>
                            <h2
                                class="font-display text-xl font-semibold text-slate-900 dark:text-slate-100"
                            >
                                Transfer ownership
                            </h2>
                            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Move this plugin to a different user account
                            </p>
                        </div>

                        <TransferOwnershipForm schema={data.transferOwnershipSchema} />
                    </article>
                {/if}
            </div>
        </section>
    {/if}
</main>
