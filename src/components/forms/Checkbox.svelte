<script lang="ts">
    export let id: string;
    export let label: string;
    export let name: string = undefined;

    export let error: string | undefined = undefined;

    export let checked = false;

    let className = "";
    export { className as class };
</script>

<div class={className}>
    <div class="flex items-center {className}">
        <input
            on:change
            bind:checked
            {id}
            {name}
            type="checkbox"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500"
        />
        <label
            for={id}
            class="block ml-2 text-sm text-gray-700 dark:text-gray-200"
        >
            {label}
        </label>
    </div>
    {#if error}
        <span class="text-sm text-red-800 dark:text-red-400">
            {error}
        </span>
    {/if}
</div>
