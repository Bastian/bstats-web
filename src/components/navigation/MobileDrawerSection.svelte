<script lang="ts">
    export let title: string;
    export let links: { text: string; href: string; [key: string]: any }[];

    export let drawerOpen: boolean;
</script>

<div class="w-full">
    <div class="flex items-center">
        <span class="w-8 h-8 text-blue-500 dark:text-blue-400">
            <slot name="icon" />
        </span>
        <span class="ml-2 font-semibold text-gray-800 dark:text-gray-200">
            {title}
        </span>
    </div>
    <div class="mt-4 space-y-4">
        {#each links as link}
            <a
                href={link.href}
                sveltekit:prefetch
                class="inline-block w-full p-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                on:click={() => (drawerOpen = false)}
            >
                {link.text}
                <slot name="link-appendix" {link} />
            </a>
        {/each}
    </div>
</div>
