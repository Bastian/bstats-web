<!--
@component
A wrapper for inputs to prevent code duplication.
-->
<script lang="ts">
    export let label: string;
    export let id: string;

    export let helpText: string | undefined = undefined;
    export let error: string | undefined = undefined;

    let className = "";
    export { className as class };
</script>

<div class={className}>
    <label
        for={id}
        class="flex items-center mb-1 text-sm font-medium text-gray-500 dark:text-gray-200"
    >
        {#if $$slots.icon}
            <span
                class="h-5 w-5 text-gray-400 dark:text-gray-300 bottom-2.5 left-3 mr-2"
            >
                <slot name="icon" />
            </span>
        {/if}
        {label}
    </label>
    <slot />
    {#if error}
        <span class="text-red-800 dark:text-red-400 text-sm">
            {error}
        </span>
    {/if}
    {#if !error && helpText}
        <span class="text-gray-400 text-sm">
            {helpText}
        </span>
    {/if}
</div>
