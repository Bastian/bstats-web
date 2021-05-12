<script lang="ts">
    export let label: string;
    export let id: string;
    export let name: string = undefined;
    export let type: "text" | "password" = "text";

    export let value = "";

    export let error: string | undefined = undefined;

    let className = "";
    export { className as class };

    // See https://stackoverflow.com/a/57393751 why we don't just bind value
    const handleInput = (event: any) => {
        value = event.target.value;
    };
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
    <input
        {id}
        {type}
        {name}
        class="w-full text-gray-700 rounded border-gray-300 dark:border-gray-600 dark:text-gray-200 dark:bg-gray-700"
        {value}
        on:change
        on:input={handleInput}
    />
    {#if error}
        <span class="text-red-800 dark:text-red-400 text-sm">
            {error}
        </span>
    {/if}
</div>
