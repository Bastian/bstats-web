<script lang="ts">
    import Button from "$components/forms/Button.svelte";
    import TextField from "$components/forms/TextField.svelte";
    import Navigation from "$components/navigation/Navigation.svelte";
    import ServiceCard from "./_ServiceCard.svelte";

    let searchText = "";
    /**
     * Search cache
     * The search text will be split according to the space
     * Each text must appear in service infos(name/platform/owner etc.) at the same time.
     *
     * If a search text contains the ':' character,
     * Then the string before this character will be treated as the specified field.
     *
     * e.g.
     * "owner:bat vault".
     * All services with "bat" include in the owner field and "vault" include in any field will be displayed.
     */
    let searchCache: Array<{ type: string; value: string }>;
    $: searchCache = searchText
        .split(" ")
        .map((val) => val.trim())
        .filter((val) => !!val)
        .map((val) => {
            const index = val.indexOf(":");
            return {
                type: (index < 0
                    ? "any"
                    : val.substring(0, index)
                ).toLowerCase(),
                value: (index < 0
                    ? val
                    : val.substring(index + 1)
                ).toLowerCase(),
            };
        });

    const serviceNames = [
        "SafeTrade",
        "Paper",
        "WorldEdit",
        "WorldGuard",
        "EssentialsX",
        "Vault",
        "ProtocolLib",
    ];
    const platforms = [
        "Bukkit / Spigot",
        "Bungeecord",
        "Sponge",
        "Server Implementation",
        "Velocity",
    ];
    const owners = [
        "Creeper",
        "Chicken",
        "Pig",
        "Bird",
        "Enderman",
        "Iron Golem",
        "Bat",
        "Axolotl",
    ];
    const services = new Array(24).fill(0).map(() => ({
        name: serviceNames[Math.floor(Math.random() * serviceNames.length)],
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        owner: owners[Math.floor(Math.random() * owners.length)],
    }));

    let filteredServices: typeof services;
    $: filteredServices = services.filter((s) => {
        for (let i = 0; i < searchCache.length; i++) {
            const search = searchCache[i];
            if (search.type === "any") {
                const fields = Object.values(s),
                    val = search.value;
                let j = 0;
                while (j < fields.length) {
                    if (fields[j].toLowerCase().includes(val)) break;
                    j++;
                }
                if (j >= fields.length) return false;
            } else {
                const field: string = s[search.type];
                if (field === undefined) return false;
                if (!field.toLowerCase().includes(search.value)) return false;
            }
        }
        return true;
    });
</script>

<svelte:head>
    <title>Service List</title>
</svelte:head>

<div class="text-white bg-gradient-to-r from-blue-900 to-blue-700">
    <div class="container py-3 mx-auto">
        <Navigation />

        <div class="pt-8 sm:pt-12 pb-8">
            <h1 class="block py-4 text-3xl sm:text-3xl font-semibold truncate">
                Search for a service
            </h1>
            <TextField
                placeholder="Search Text"
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
            <ServiceCard
                name={service.name}
                platform={service.platform}
                owner={service.owner}
                currentServers={Math.floor(Math.random() * 2345)}
                maxServers={Math.floor(Math.random() * 2345)}
                currentUsers={Math.floor(Math.random() * 2345)}
                maxUsers={Math.floor(Math.random() * 2345)}
            />
        {/each}
    </div>

    <div class="container mx-auto py-8 flex justify-center">
        <!-- TODO: Infinite scroll? -->
        <Button class="">Load more ...</Button>
    </div>
</div>
