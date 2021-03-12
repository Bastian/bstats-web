<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import Label from "../Label.svelte";
    import MapIcon from "../hero-icons/MapIcon.svelte";
    import GlobeIcon from "../hero-icons/GlobeIcon.svelte";
    import CollectionIcon from "../hero-icons/CollectionIcon.svelte";

    export let open = false;

    const handleClose = () => {
        open = false;
    };

    $: {
        // Prevent scrolling of the background when drawer is open
        if (typeof window !== "undefined") {
            if (open) {
                document.documentElement.classList.add("overflow-hidden");
            } else {
                document.documentElement.classList.remove("overflow-hidden");
            }
        }
    }
</script>

<style>
    .drawer {
        max-width: 22rem;
        width: 80vw;
    }
</style>

{#if open}
    <!-- Mobile Drawer -->
    <div
        transition:fly={{ x: -200, duration: 200 }}
        class="overflow-y-auto fixed top-0 bottom-0 left-0 z-50 text-black bg-white drawer dark:bg-gray-900 dark:text-white"
    >
        <div class="my-12 text-4xl font-bold text-center text-white text-blue-800 dark:text-blue-400">
            bStats
        </div>
        <div class="py-2 mx-8 border-t-2 border-gray-200"></div>
        <div class="p-8 py-4 w-full">
            <div class="flex items-center">
                <MapIcon class="w-8 h-8 text-blue-500 dark:text-blue-400"/>
                <span class="ml-2 font-semibold text-gray-800 dark:text-gray-200">
                    Navigation
                </span>
            </div>
            <a href="/" class="block p-4 my-4 w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">Plugin List</a>
        </div>

        <div class="p-8 py-4 w-full">
            <div class="flex items-center">
                <GlobeIcon class="w-8 h-8 text-blue-500 dark:text-blue-40"/>
                <span class="ml-2 font-semibold text-gray-800 dark:text-gray-200">
                    Global Stats
                </span>
            </div>
            <a href="/" class="block p-4 my-4 w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">Bukkit / Spigot</a>
            <a href="/" class="block p-4 my-4 w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">Bungeecord</a>
            <a href="/" class="block p-4 my-4 w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">Sponge</a>
            <a href="/" class="block p-4 my-4 w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">Velocity</a>
        </div>

        <div class="p-8 py-4 w-full">
            <div class="flex items-center">
                <CollectionIcon class="w-8 h-8 text-blue-500 dark:text-blue-40"/>
                <span class="ml-2 font-semibold text-gray-800 dark:text-gray-200">
                    My Plugins
                </span>
            </div>
            <a href="/" class="flex flex-row flex-nowrap items-center py-3 px-4 my-4 w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
                <span class="min-w-0 truncate">
                    SafeTrade
                </span>
                <Label class="ml-2">
                    Bukkit / Spigot
                </Label>
            </a>
            <a href="/" class="flex flex-row flex-nowrap items-center py-3 px-4 my-4 w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
                <span class="min-w-0 truncate">
                    Super Duper Spleef
                </span>
                <Label class="ml-2">
                    Bungeecord
                </Label>
            </a>
        </div>
    </div>

    <!-- Overlay for the background -->
    <div
        on:click={handleClose}
        transition:fade={{ duration: 200 }}
        class="fixed top-0 right-0 bottom-0 left-0 z-40 bg-black bg-opacity-60"
    ></div>
{/if}
