<script lang="ts">
    export let label: string;
    export let id: string;
    export let type: "text" | "password" = "text";

    let className = "";
    export { className as class };
</script>


<div class="{className}">
    <label for="{id}" class="flex items-center mb-1 text-sm font-medium text-gray-500 dark:text-gray-200">
        {#if $$slots.icon}
            <span class="h-5 w-5 text-gray-400 dark:text-gray-300 bottom-2.5 left-3 mr-2">
                <slot name="icon"></slot>
            </span>
        {/if}
        {label}
    </label>
    <input
        id="{id}"
        type="{type}"
        class="w-full text-gray-700 rounded border-gray-300 dark:border-gray-600 dark:text-gray-200 dark:bg-gray-700"
    />
</div>
