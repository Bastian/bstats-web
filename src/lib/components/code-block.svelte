<script lang="ts">
    import { tabbableIfOverflow } from '$lib/attachments/tabbable-if-overflow';
    import { highlightCode } from '$lib/utils/shiki';
    import type { BundledLanguage, ShikiTransformer } from 'shiki';
    import type { Snippet } from 'svelte';

    type CodeBlockProps = {
        code: string;
        lang: BundledLanguage;
        transformers?: ShikiTransformer[];
        header?: Snippet;
    };

    let { code, lang, transformers, header }: CodeBlockProps = $props();
    let highlightPromise = $derived(highlightCode(code, lang, transformers));
</script>

<div
    {@attach tabbableIfOverflow}
    class="relative overflow-x-auto rounded-xl bg-slate-900 px-4 py-5 text-sm leading-relaxed shadow-inner focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none sm:px-6 sm:py-6 [&>*]:bg-slate-900! dark:bg-dark-900 dark:[&>*]:bg-dark-900!"
>
    {#if header}
        <div class="mb-3">
            {@render header()}
        </div>
    {/if}
    {#await highlightPromise}
        <pre class="text-slate-100"><code>{code}</code></pre>
    {:then html}
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html html}
    {:catch}
        <pre class="text-slate-100"><code>{code}</code></pre>
    {/await}
</div>
