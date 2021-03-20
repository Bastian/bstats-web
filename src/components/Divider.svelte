<script lang="ts">
    let className: string | null;
    export { className as class };

    export let text: string | null
</script>

<div class="flex relative justify-center w-full h-6 {className}">
    <div class="absolute top-3 h-0.5 bg-gray-300 w-full dark:bg-gray-500"></div>
    {#if text}
        <span class="z-10 px-2 text-gray-600 bg-white dark:bg-gray-800 dark:text-gray-300">
            {text}
        </span>
    {/if}
</div>
