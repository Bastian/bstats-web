<script lang="ts">
    import {fade} from "svelte/transition";

    export let open: boolean;
    export let direction: "left" | "right" = "right";

    export let actionLabel: string | null = null;
    export let links: { text: string; href: string; [key: string]: any }[];
</script>

{#if open}
    <div class="relative">
        <div
            transition:fade={{ duration: 100 }}
            class="absolute z-50 pt-1"
            class:right-0={direction === "left"}
        >
            <div class="overflow-hidden whitespace-nowrap text-black bg-white rounded-lg ring-1 ring-black ring-opacity-5 shadow-lg dark:ring-opacity-10 dark:ring-white dark:bg-gray-800 dark:text-gray-200">
                {#each links as link}
                    <a sveltekit:prefetch href={link.href} class="block p-4 w-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-700">
                        {link.text}
                        <slot name="link-appendix" {link}/>
                    </a>
                {/each}
                {#if actionLabel}
                    <a href="/" class="inline-flex justify-center focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-700 items-center p-3 w-full text-gray-900 bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-700">
                        {#if $$slots["action-icon"]}
                            <span class="w-6 h-6 text-blue-500 dark:text-blue-400">
                                <slot name="action-icon"/>
                            </span>
                        {/if}
                        <span class="ml-1 pt-0.5 font-semibold text-gray-800 dark:text-gray-200">
                            {actionLabel}
                        </span>
                    </a>
                {/if}
            </div>
        </div>
    </div>
{/if}
