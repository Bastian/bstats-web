<script lang="ts">
    let className = "";
    export { className as class };

    export let type: string = undefined;
</script>

<button 
    on:click
    {type}
    class="bg-blue-800 text-white py-2 px-6 rounded focus:outline-none focus:ring focus:border-blue-300 {className}"
>
    <slot></slot>
</button>
