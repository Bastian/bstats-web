<script lang="ts">
    import { fade } from "svelte/transition";

    export let open: boolean;
    export let direction: "left" | "right" = "right";
</script>

{#if open}
    <div class="relative">
        <div
            transition:fade={{ duration: 100 }}
            class="absolute z-50 pt-1"
            class:right-0={direction === "left"}
        >
            <div
                class="overflow-hidden text-black bg-white rounded-lg shadow-lg whitespace-nowrap ring-1 ring-black ring-opacity-5 dark:ring-opacity-10 dark:ring-white dark:bg-gray-800 dark:text-gray-200"
            >
                <slot />
            </div>
        </div>
    </div>
{/if}
