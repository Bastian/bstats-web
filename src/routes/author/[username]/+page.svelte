<script lang="ts">
    import { resolve } from '$app/paths';
    import Badge from '$lib/components/badge.svelte';
    import { TextInput } from '$lib/components/input/text';
    import PageHero from '$lib/components/page-hero.svelte';
    import { Table } from '$lib/components/table';
    import { MetaTags } from 'svelte-meta-tags';
    import type { PageData } from './$types';
    import { page } from '$app/state';
    import { getCanonicalUrl } from '$lib/utils/url';

    let { data }: { data: PageData } = $props();

    let searchValue = $state('');
    let filteredPlugins = $derived(
        data.plugins.filter((plugin) => {
            const query = searchValue.trim().toLowerCase();
            if (!query) return true;
            return (
                plugin.name.toLowerCase().includes(query) ||
                plugin.software.name.toLowerCase().includes(query)
            );
        })
    );
</script>

<MetaTags
    title="{data.username} - bStats"
    description="View plugins maintained by {data.username} on bStats."
    openGraph={{
        title: data.username,
        description: `View plugins maintained by ${data.username} on bStats.`,
        type: 'website',
        url: getCanonicalUrl(page.url),
        siteName: 'bStats',
        locale: 'en_US'
    }}
/>

<main class="pb-24">
    <PageHero>
        {#snippet badge()}<Badge>Author</Badge>{/snippet}
        {#snippet title()}{data.username}{/snippet}
        {#snippet content()}
            All plugins maintained by {data.username}. Follow the links to inspect charts and
            adoption numbers.
        {/snippet}
    </PageHero>

    <section class="doc-container mt-12 space-y-6">
        <TextInput.Root>
            <label for="author-plugin-search">Filter plugins</label>
            <TextInput.Input
                id="author-plugin-search"
                type="text"
                class="input-control"
                placeholder="Search by name or software"
                bind:value={searchValue}
            />
        </TextInput.Root>
        <div class="overflow-x-auto">
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Software</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {#if filteredPlugins.length === 0}
                        <Table.Row>
                            <Table.Cell
                                colspan={2}
                                class="py-6 text-center text-slate-500 dark:text-slate-400"
                            >
                                No plugins {searchValue ? 'match your search' : 'yet'}.
                            </Table.Cell>
                        </Table.Row>
                    {:else}
                        {#each filteredPlugins as plugin (plugin.id)}
                            <Table.Row>
                                <Table.Cell
                                    class="font-semibold text-slate-900 dark:text-slate-100"
                                >
                                    <a
                                        class="hover:text-brand-600"
                                        href={resolve(
                                            `/plugin/${plugin.software.url}/${plugin.name}/${plugin.id}`
                                        )}
                                    >
                                        {plugin.name}
                                    </a>
                                </Table.Cell>
                                <Table.Cell class="text-slate-600 dark:text-slate-400">
                                    {#if plugin.software.globalPlugin}
                                        <a
                                            class="hover:text-brand-600"
                                            href={resolve(`/global/${plugin.software.url}`)}
                                        >
                                            {plugin.software.name}
                                        </a>
                                    {:else}
                                        {plugin.software.name}
                                    {/if}
                                </Table.Cell>
                            </Table.Row>
                        {/each}
                    {/if}
                </Table.Body>
            </Table.Root>
        </div>
    </section>
</main>
