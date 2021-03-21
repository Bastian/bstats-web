<script lang="ts">
    let className: string = "";
    export { className as class };
</script>

<button class="bg-blue-800 text-white py-2 px-6 rounded focus:outline-none focus:ring focus:border-blue-300 {className}">
    <slot></slot>
</button>
