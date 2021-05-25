<script lang="ts">
    let className = "";
    export { className as class };
</script>

<button
    on:click
    class="{className} flex items-center justify-center w-full py-2 pl-2 pr-4 text-gray-700 border border-gray-300 rounded dark:text-gray-200 dark:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
>
    {#if $$slots.icon}
        <div class="flex items-center w-6 h-6 mr-2">
            <slot name="icon" />
        </div>
    {/if}
    <slot />
</button>
