<script lang="ts">
    export let id: string;
    export let label: string;

    let className: string = "";
    export { className as class };
</script>

<div class="flex items-center {className}">
    <input id="{id}" type="checkbox" class="w-4 h-4 text-blue-600 rounded border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500">
    <label for="{id}" class="block ml-2 text-sm text-gray-700 dark:text-gray-200">
        {label}
    </label>
</div>
