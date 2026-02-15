<script lang="ts">
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
    import Badge from '$lib/components/badge.svelte';
    import PageHero from '$lib/components/page-hero.svelte';
    import { Table, createTableSort } from '$lib/components/table';
    import Pagination from '$lib/components/pagination.svelte';
    import { onMount } from 'svelte';
    import { TextInput } from '$lib/components/input/text';
    import { MetaTags } from 'svelte-meta-tags';
    import { getCanonicalUrl } from '$lib/utils/url';

    interface PluginListItem {
        pluginId: number;
        softwareUrl: string;
        name: string;
        softwareName: string;
        ownerName: string;
        servers?: number;
        players?: number;
    }

    let searchValue = $state('');
    let plugins = $state<PluginListItem[]>([]);
    let isLoading = $state(true);
    let hasError = $state(false);
    let paginationPage = $state(1);

    const perPage = 10;
    const formatter = new Intl.NumberFormat();

    const sort = createTableSort({
        column: 'servers',
        direction: 'desc',
        columns: {
            name: (p: PluginListItem) => p.name,
            software: (p: PluginListItem) => p.softwareName,
            owner: (p: PluginListItem) => p.ownerName,
            servers: (p: PluginListItem) => p.servers ?? 0,
            players: (p: PluginListItem) => p.players ?? 0
        }
    });

    let sortedPlugins = $derived.by(() => {
        const query = searchValue.trim().toLowerCase();
        const filtered = query
            ? plugins.filter(
                  (plugin) =>
                      plugin.name.toLowerCase().includes(query) ||
                      plugin.softwareName.toLowerCase().includes(query) ||
                      plugin.ownerName.toLowerCase().includes(query)
              )
            : plugins;
        return sort.apply(filtered);
    });

    let paginatedPlugins = $derived.by(() => {
        const start = (paginationPage - 1) * perPage;
        const end = start + perPage;
        return sortedPlugins.slice(start, end);
    });

    // Reset to page 1 when search or sort changes
    $effect(() => {
        // Track dependencies
        searchValue;
        sort.column;
        sort.direction;
        paginationPage = 1;
    });

    onMount(() => {
        fetch('/api/v1/datatable')
            .then((response) => response.json())
            .then((data) => {
                plugins = data || [];
                isLoading = false;
            })
            .catch(() => {
                hasError = true;
                isLoading = false;
            });
    });
</script>

<MetaTags
    title="Plugin list - bStats"
    description="Browse thousands of plugins reporting metrics to bStats. Search by name, owner, or platform."
    openGraph={{
        title: 'Plugin list',
        description:
            'Browse thousands of plugins reporting metrics to bStats. Search by name, owner, or platform.',
        type: 'website',
        url: getCanonicalUrl(page.url),
        siteName: 'bStats',
        locale: 'en_US'
    }}
/>

<main class="pb-24">
    <PageHero>
        {#snippet badge()}<Badge>Directory</Badge>{/snippet}
        {#snippet title()}Plugin list{/snippet}
        {#snippet content()}
            Search thousands of plugins reporting metrics to bStats. Shows plugins with at least one
            server.
        {/snippet}
    </PageHero>

    <section class="doc-container mt-12 space-y-6">
        <div class="grid gap-4 lg:flex lg:items-end lg:justify-between">
            <TextInput.Root class="lg:w-80">
                <label for="plugin-search">Search</label>
                <TextInput.Input
                    id="plugin-search"
                    type="text"
                    placeholder="Filter by name, owner, or software"
                    bind:value={searchValue}
                />
            </TextInput.Root>
            <div
                class="flex items-center gap-3 text-xs tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400"
            >
                <span>
                    {#if isLoading}
                        &nbsp;
                    {:else}
                        {sortedPlugins.length}
                        {sortedPlugins.length === 1 ? 'plugin' : 'plugins'}
                    {/if}
                </span>
            </div>
        </div>

        <div class="overflow-x-auto">
            <Table.Root {sort}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell sortKey="name">Name</Table.HeaderCell>
                        <Table.HeaderCell sortKey="software">Software</Table.HeaderCell>
                        <Table.HeaderCell sortKey="owner">Owner</Table.HeaderCell>
                        <Table.HeaderCell sortKey="servers" align="right">Servers</Table.HeaderCell>
                        <Table.HeaderCell sortKey="players" align="right">Players</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {#if isLoading}
                        <Table.Row>
                            <Table.Cell
                                colspan={5}
                                class="py-6 text-center text-slate-500 dark:text-slate-400"
                            >
                                Loading plugins…
                            </Table.Cell>
                        </Table.Row>
                    {:else if hasError}
                        <Table.Row>
                            <Table.Cell
                                colspan={5}
                                class="py-6 text-center text-rose-600 dark:text-rose-400"
                            >
                                Failed to load plugins. Please try again later.
                            </Table.Cell>
                        </Table.Row>
                    {:else if sortedPlugins.length === 0}
                        <Table.Row>
                            <Table.Cell
                                colspan={5}
                                class="py-6 text-center text-slate-500 dark:text-slate-400"
                            >
                                No plugins match your search.
                            </Table.Cell>
                        </Table.Row>
                    {:else}
                        {#each paginatedPlugins as plugin (plugin.pluginId)}
                            <Table.Row>
                                <Table.Cell>
                                    <a
                                        href={resolve(
                                            `/plugin/${plugin.softwareUrl}/${plugin.name}/${plugin.pluginId}`
                                        )}
                                        class="font-semibold text-slate-900 hover:text-brand-600 dark:text-slate-100"
                                    >
                                        {plugin.name}
                                    </a>
                                </Table.Cell>
                                <Table.Cell class="text-slate-600 dark:text-slate-400"
                                    >{plugin.softwareName}</Table.Cell
                                >
                                <Table.Cell>
                                    <a
                                        href={resolve(`/author/${plugin.ownerName}`)}
                                        class="text-slate-600 hover:text-brand-600 dark:text-slate-400"
                                    >
                                        {plugin.ownerName}
                                    </a>
                                </Table.Cell>
                                <Table.Cell
                                    align="right"
                                    class="font-semibold text-slate-900 dark:text-slate-100"
                                >
                                    {formatter.format(plugin.servers || 0)}
                                </Table.Cell>
                                <Table.Cell
                                    align="right"
                                    class="font-semibold text-slate-900 dark:text-slate-100"
                                >
                                    {formatter.format(plugin.players || 0)}
                                </Table.Cell>
                            </Table.Row>
                        {/each}
                    {/if}
                </Table.Body>
            </Table.Root>
        </div>

        {#if !isLoading && !hasError && sortedPlugins.length > 0}
            <div class="mt-6">
                <Pagination count={sortedPlugins.length} {perPage} bind:page={paginationPage} />
            </div>
        {/if}
    </section>
</main>
