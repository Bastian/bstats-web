<script lang="ts">
    let className: string = "";
    export { className as class };
</script>

<span class="py-1 px-2 text-xs font-semibold text-yellow-900 dark:text-black bg-yellow-400 dark:bg-yellow-500 rounded-full truncate {className}">
    <slot></slot>
</span>
