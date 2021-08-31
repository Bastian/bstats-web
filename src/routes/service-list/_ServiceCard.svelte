<script lang="ts">
    import ServerIcon from "$components/hero-icons/ServerIcon.svelte";
    import UsersIcon from "$components/hero-icons/UsersIcon.svelte";
    import Label from "$components/Label.svelte";

    export let name: string;
    export let platform: string;
    export let owner: string;
    export let currentServers: number = undefined;
    export let maxServers: number = undefined;
    export let currentUsers: number = undefined;
    export let maxUsers: number = undefined;
</script>

<a
    href="/global/bukkit"
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
        <span class="px-6 text-sm text-gray-600 dark:text-gray-400"
            >by {owner}</span
        >
        <div class="px-6 pb-2 pt-4">
            <div
                class="inline-flex items-center text-gray-800 dark:text-gray-200"
            >
                <ServerIcon
                    class="h-5 text-gray-600 dark:text-gray-400 stroke-current"
                />
                <div class="pl-2">
                    <span class="pr-1 text-xl">
                        {currentServers?.toLocaleString("en-US") ?? "???"}
                    </span>
                    <span class="text-gray-700 text-sm dark:text-gray-200">
                        / {maxServers?.toLocaleString("en-US") ?? "???"}
                    </span>
                </div>
            </div>
        </div>
        <div class="px-6 pb-4">
            <div
                class="inline-flex items-center text-gray-800 dark:text-gray-200"
            >
                <UsersIcon
                    class="h-5 text-gray-600 dark:text-gray-400 stroke-current"
                />
                <div class="pl-2">
                    <span class="pr-1 text-xl">
                        {currentUsers?.toLocaleString("en-US") ?? "???"}
                    </span>
                    <span class="text-gray-700 text-sm dark:text-gray-200">
                        / {maxUsers?.toLocaleString("en-US") ?? "???"}
                    </span>
                </div>
            </div>
        </div>
    </article>
</a>
