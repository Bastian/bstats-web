<script lang="ts">
    import { fade } from "svelte/transition";
    import Label from "../Label.svelte";
    import PlusIcon from "../hero-icons/PlusIcon.svelte";

    export let open: boolean;

    const plugins = [{
        name: "SafeTrade",
        software: "Bukkit / Spigot",
    }, {
        name: "Super Duper Spleef",
        software: "Bungeecord",
    }];
</script>

{#if open}
    <div transition:fade={{ duration: 100 }} class="absolute z-50 mt-2 ml-4">
        <div class="overflow-hidden text-black bg-white rounded-lg ring-1 ring-black ring-opacity-5 shadow-lg dark:bg-gray-800 dark:text-gray-200">
            {#each plugins as plugin}
                <a href="/" class="block p-5 w-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    {plugin.name}
                    <Label class="ml-1">
                        {plugin.software}
                    </Label>
                </a>
            {/each}
            <a href="/" class="block inline-flex justify-center items-center p-4 w-full text-gray-900 bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-700">
                <PlusIcon class="w-6 h-6 text-blue-500 dark:text-blue-400"/>
                <span class="ml-1 pt-0.5 font-semibold text-gray-800 dark:text-gray-200">Add Plugin</span>
            </a>
        </div>
    </div>
{/if}
