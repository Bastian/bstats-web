<script lang="ts">
    import InputBase from "./InputBase.svelte";

    export let label: string;
    /**
     * Hides the label. Please note that your still have to provide a label for
     * accessibility concerns. It will just not be displayed in the UI.
     */
    export let hideLabel = false;
    export let id: string;
    export let name: string = undefined;
    export let type: "text" | "password" = "text";
    export let placeholder: string = undefined;

    export let disabled = false;

    export let value = "";

    export let helpText: string | undefined = undefined;

    export let error: string | undefined = undefined;

    let className = "";
    export { className as class };

    export let classLabel = "";

    // See https://stackoverflow.com/a/57393751 why we don't just bind value
    const handleInput = (event: any) => {
        value = event.target.value;
    };
</script>

<InputBase
    {id}
    {label}
    {hideLabel}
    {helpText}
    {error}
    {classLabel}
    class={className}
>
    <slot name="icon" slot="icon" />
    <input
        {id}
        {type}
        {name}
        class:text-gray-700={!disabled}
        class:text-gray-500={disabled}
        class:dark:text-gray-200={!disabled}
        class:dark:text-gray-400={disabled}
        class="w-full placeholder-gray-500 placeholder-opacity-50 border-gray-300 rounded dark:placeholder-gray-400 dark:border-gray-600 dark:bg-gray-700"
        {value}
        {placeholder}
        {disabled}
        on:change
        on:input={handleInput}
    />
</InputBase>
