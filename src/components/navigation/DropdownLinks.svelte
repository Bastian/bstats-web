<script lang="ts">
    export let actionLabel: { text: string; href: string } | null = null;
    export let links: { text: string; href: string; [key: string]: any }[];
</script>

{#each links as link}
    <a
        sveltekit:prefetch
        href={link.href}
        class="block w-full p-4 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-700"
    >
        {link.text}
        <slot name="link-appendix" {link} />
    </a>
{/each}
{#if actionLabel}
    <a
        href={actionLabel.href}
        class="inline-flex items-center justify-center w-full p-3 text-gray-900 bg-gray-100 focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-700 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-700"
    >
        {#if $$slots["action-icon"]}
            <span class="w-6 h-6 text-blue-500 dark:text-blue-400">
                <slot name="action-icon" />
            </span>
        {/if}
        <span
            class="ml-1 pt-0.5 font-semibold text-gray-800 dark:text-gray-200"
        >
            {actionLabel.text}
        </span>
    </a>
{/if}
