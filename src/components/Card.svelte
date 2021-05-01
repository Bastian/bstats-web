<script lang="ts">
    let className = "";
    export { className as class };

    export let title: string | null;
    export let link: { text: string; href: string; };
</script>

<div class="flex flex-col items-center w-full max-w-xl {className}">
    {#if title}
        <span class="text-3xl font-bold text-blue-900 dark:text-blue-400">
            {title}
        </span>
    {/if}
    <div class="p-8 mt-4 w-full bg-white rounded shadow dark:bg-gray-800">
        <slot></slot>
    </div>
    {#if link}
        <a href="{link.href}" class="mt-4 font-medium text-blue-900 dark:text-gray-200">
            {link.text}
        </a>
    {/if}
</div> 
