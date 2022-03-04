<script lang="ts">
    import Label from "$components/Label.svelte";

    export let name: string;
    export let platform: string;
    export let pluginId: number;
</script>

<a
    href="/services/{pluginId}"
    class="outline-none focus:ring ring-yellow-500 ring-opacity-50 dark:ring-opacity-75 rounded-md bg-white dark:bg-gray-800 shadow hover:shadow-lg transition-all"
>
    <article>
        <div class="pt-6 px-6 flex items-center gap-1">
            <h2
                class="text-lg font-medium truncate text-gray-900 dark:text-gray-100"
            >
                {name}
            </h2>
            <Label class="!px-1.5 !py-0.5 !text-xs">{platform}</Label>
        </div>
        <div class="pb-4 px-7">
            <span class="text-sm text-gray-400 dark:text-gray-400"
                >Plugin ID:</span
            >
            <span class="font-medium truncate text-gray-900 dark:text-gray-100"
                >{pluginId}</span
            >
        </div>
    </article>
</a>
