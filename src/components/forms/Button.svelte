<script lang="ts">
    let className = "";
    export { className as class };

    export let small = false;
    export let disabled = false;
    export let type: string = undefined;
</script>

<button
    on:click
    {type}
    class:text-sm={small}
    class:opacity-60={disabled}
    {disabled}
    class="bg-blue-800 text-white py-2 px-6 rounded focus:outline-none focus:ring focus:border-blue-300 {className}"
>
    <slot />
</button>

<style>
    button:disabled {
        cursor: default;
        pointer-events: all;
    }
</style>
