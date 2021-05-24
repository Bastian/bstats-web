<script lang="ts">
    import DotsHorizontalIcon from "./hero-icons/DotsHorizontalIcon.svelte";

    export let step: number | undefined = undefined;
    export let title: string;
    export let inactive = false;
    export let noLine = false;

    let className = "";
    export { className as class };
</script>

<article aria-disabled={inactive} class="flex {className}">
    <!-- Step -->
    <div class="flex flex-col">
        <!-- ring-yellow-300 dark:ring-blue-500 bg-yellow-500 dark:bg-gray-700 -->
        <div
            class:ring-yellow-300={!inactive}
            class:dark:ring-blue-500={!inactive}
            class:bg-yellow-500={!inactive}
            class:dark:bg-gray-700={!inactive}
            class:ring-gray-300={inactive}
            class:bg-gray-200={inactive}
            class:dark:ring-gray-500={inactive}
            class:dark:bg-gray-400={inactive}
            class="flex items-center justify-center rounded-full w-7 h-7 ring ring-opacity-75"
        >
            <div class="clear-both " />
            {#if step}
                <!-- Dot -->
                <span
                    class:text-white={!inactive}
                    class:text-gray-600={inactive}
                    class="text-lg font-bold"
                >
                    {step}
                </span>
            {:else}
                <span class="text-xl font-bold text-white">
                    <DotsHorizontalIcon class="w-8 h-8 p-1" />
                </span>
            {/if}
        </div>
        <!-- Line -->
        {#if !noLine}
            <div
                class:bg-yellow-300={!inactive}
                class:dark:bg-blue-500={!inactive}
                class:bg-gray-300={inactive}
                class:dark:bg-gray-500={inactive}
                class="w-1 h-full ml-3"
            />
        {/if}
    </div>

    <div class="flex flex-col max-w-full pr-1 overflow-hidden">
        <!-- Title -->
        <h2
            class:text-gray-700={!inactive}
            class:dark:text-gray-200={!inactive}
            class:text-gray-500={inactive}
            class:dark:text-gray-500={inactive}
            class="ml-4 text-lg font-bold"
        >
            {title}
        </h2>
        <!-- Content -->
        <div class="mt-2 mb-6 ml-4">
            {#if $$slots.description}
                <span
                    class="block mt-1 text-gray-500 text-md dark:text-gray-400 max-w-prose"
                >
                    <slot name="description" />
                </span>
            {/if}
            <slot />
        </div>
    </div>
</article>
