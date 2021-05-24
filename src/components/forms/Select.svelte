<script lang="ts">
    import InputBase from "./InputBase.svelte";

    export let label: string;
    export let id: string;
    export let name: string = undefined;

    export let options: Array<{
        value: any;
        label: any;
    }>;
    export let value: any;

    export let helpText: string | undefined = undefined;

    export let error: string | undefined = undefined;

    let className = "";
    export { className as class };
</script>

<InputBase {id} {label} {helpText} {error} class={className}>
    <slot name="icon" slot="icon" />
    <select
        {id}
        class="w-full text-gray-700 border-gray-300 rounded dark:border-gray-600 dark:text-gray-200 dark:bg-gray-700"
        {name}
        bind:value
    >
        {#each options as option (option.value)}
            <option value={option.value}>{option.label}</option>
        {/each}
    </select>
</InputBase>
