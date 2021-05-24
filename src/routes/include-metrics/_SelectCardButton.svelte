<script lang="ts">
    export let text: string;
    export let logoSrc: string = undefined;
    export let logoSrcDark: string = undefined;

    export let selected: boolean;
    export let disabled = false;

    let className = "";
    export { className as class };
</script>

<button
    on:click
    {disabled}
    class:ring={selected}
    class:ring-orange-300={selected}
    class:ring-gray-300={!selected}
    class:cursor-default={disabled}
    class:pointer-events-none={disabled}
    class="{className} w-52 h-28 m-2 rounded-md focus:outline-none focus:ring ring-orange-300 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow p-2 flex flex-col items-center justify-between"
>
    {#if $$slots.logo}
        <slot name="logo" />
    {/if}
    {#if logoSrc}
        <img
            alt=""
            src={logoSrc}
            class:dark:hidden={logoSrcDark}
            class="h-16 p-1"
        />
    {/if}
    {#if logoSrcDark}
        <img alt="" src={logoSrcDark} class="hidden h-16 p-1 dark:block" />
    {/if}
    <span class="text-lg font-bold text-gray-600 dark:text-gray-200">
        {text}
    </span>
</button>
