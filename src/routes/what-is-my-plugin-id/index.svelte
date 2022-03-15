<script context="module" lang="ts">
    import TextField from "$components/forms/TextField.svelte";
    import type { Load } from "@sveltejs/kit";
    import Button from "$components/forms/Button.svelte";
    import Navigation from "$components/navigation/Navigation.svelte";
    import PluginCard from "./_PluginCard.svelte";
    import { findUserService } from "$api/findUserService";
    import type { Service } from "$defs/service.interface";
    import type { Software } from "$defs/software/software.interface";
    import { session } from "$app/stores";

    export const load: Load = async ({ fetch, session }) => {
        const { API_BASE_URL, user } = session;
        // The user is not logged in. Redirect to the login page
        if (!user) {
            return { status: 307, redirect: "/login" };
        }

        let services = await findUserService(
            API_BASE_URL,
            user.uid,
            false,
            fetch
        );
        return {
            props: { services },
        };
    };
</script>

<script lang="ts">
    //TODO Do not load all data from the backend at once. Load in blocks on the web side.
    export let services: Service[];
    let searchText = "";

    const softwares = {};
    $session.softwareList.forEach(
        (val: Software) => (softwares[val.id] = val.name)
    );

    let filteredServices: typeof services;
    $: filteredServices = services.filter((s) =>
        s.name.toLowerCase().includes(searchText.toLowerCase())
    );
</script>

<svelte:head>
    <title>What is my plugin id ?</title>
</svelte:head>

<div class="text-white bg-gradient-to-r from-blue-900 to-blue-700">
    <div class="container py-3 mx-auto">
        <Navigation />

        <div class="pt-8 sm:pt-12 pb-8">
            <h1 class="block py-4 text-3xl sm:text-3xl font-semibold truncate">
                Search for your plugin
            </h1>
            <TextField
                placeholder="Plugin Name"
                class="max-w-sm"
                id="search"
                label="Search"
                hideLabel
                bind:value={searchText}
            />
        </div>
    </div>
</div>

<div class="flex-grow bg-gray-100 dark:bg-gray-900">
    <div
        class="container mx-auto pt-8 sm:pt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
        {#each filteredServices as service}
            <PluginCard
                name={service.name}
                platform={softwares[service.software.id]}
                pluginId={service.id}
            />
        {/each}
    </div>

    <div class="container mx-auto py-8 flex justify-center">
        <!-- TODO: Infinite scroll? -->
        <Button class="">Load more ...</Button>
    </div>
</div>
