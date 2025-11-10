<script lang="ts">
    import { resolve } from '$app/paths';
    import Badge from '$lib/components/Badge.svelte';
    import PageHero from '$lib/components/PageHero.svelte';
    import { Table } from '$lib/components/table';
    import Pagination from '$lib/components/Pagination.svelte';
    import { onMount } from 'svelte';
    import { TextInput } from '$lib/components/input/text';

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
    let filteredPlugins = $state<PluginListItem[]>([]);
    let isLoading = $state(true);
    let hasError = $state(false);
    let page = $state(1);

    const perPage = 10;
    const formatter = new Intl.NumberFormat();

    let paginatedPlugins = $derived.by(() => {
        const start = (page - 1) * perPage;
        const end = start + perPage;
        return filteredPlugins.slice(start, end);
    });

    function filterPlugins() {
        const query = searchValue.trim().toLowerCase();
        if (!query) {
            filteredPlugins = plugins;
            page = 1;
            return;
        }
        filteredPlugins = plugins.filter((plugin) => {
            return (
                plugin.name.toLowerCase().includes(query) ||
                plugin.softwareName.toLowerCase().includes(query) ||
                plugin.ownerName.toLowerCase().includes(query)
            );
        });
        page = 1;
    }

    onMount(() => {
        fetch('/api/v1/datatable')
            .then((response) => response.json())
            .then((data) => {
                plugins = data || [];
                plugins.sort((a, b) => (b.servers || 0) - (a.servers || 0));
                filteredPlugins = plugins;
                isLoading = false;
            })
            .catch(() => {
                hasError = true;
                isLoading = false;
            });
    });

    $effect(() => {
        filterPlugins();
    });
</script>

<svelte:head>
    <meta name="description" content="Browse plugins reporting to bStats." />
    <title>bStats - Plugin list</title>
</svelte:head>

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
            <div class="flex items-center gap-3 text-xs tracking-[0.2em] text-slate-500 uppercase">
                <span>
                    {#if isLoading}
                        &nbsp;
                    {:else}
                        {filteredPlugins.length}
                        {filteredPlugins.length === 1 ? 'plugin' : 'plugins'}
                    {/if}
                </span>
            </div>
        </div>

        <div class="overflow-x-auto">
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Software</Table.HeaderCell>
                        <Table.HeaderCell>Owner</Table.HeaderCell>
                        <Table.HeaderCell align="right">Servers</Table.HeaderCell>
                        <Table.HeaderCell align="right">Players</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {#if isLoading}
                        <Table.Row>
                            <Table.Cell colspan={5} class="py-6 text-center text-slate-500">
                                Loading plugins…
                            </Table.Cell>
                        </Table.Row>
                    {:else if hasError}
                        <Table.Row>
                            <Table.Cell colspan={5} class="py-6 text-center text-rose-600">
                                Failed to load plugins. Please try again later.
                            </Table.Cell>
                        </Table.Row>
                    {:else if filteredPlugins.length === 0}
                        <Table.Row>
                            <Table.Cell colspan={5} class="py-6 text-center text-slate-500">
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
                                        class="font-semibold text-slate-900 hover:text-brand-600"
                                    >
                                        {plugin.name}
                                    </a>
                                </Table.Cell>
                                <Table.Cell class="text-slate-600">{plugin.softwareName}</Table.Cell
                                >
                                <Table.Cell>
                                    <a
                                        href={resolve(`/author/${plugin.ownerName}`)}
                                        class="text-slate-600 hover:text-brand-600"
                                    >
                                        {plugin.ownerName}
                                    </a>
                                </Table.Cell>
                                <Table.Cell align="right" class="font-semibold text-slate-900">
                                    {formatter.format(plugin.servers || 0)}
                                </Table.Cell>
                                <Table.Cell align="right" class="font-semibold text-slate-900">
                                    {formatter.format(plugin.players || 0)}
                                </Table.Cell>
                            </Table.Row>
                        {/each}
                    {/if}
                </Table.Body>
            </Table.Root>
        </div>

        {#if !isLoading && !hasError && filteredPlugins.length > 0}
            <div class="mt-6">
                <Pagination count={filteredPlugins.length} {perPage} bind:page />
            </div>
        {/if}
    </section>
</main>
