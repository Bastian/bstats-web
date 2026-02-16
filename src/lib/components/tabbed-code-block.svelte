<script lang="ts">
    import CodeBlock from './code-block.svelte';
    import type { BundledLanguage } from 'shiki';

    type Variant = {
        lang: BundledLanguage;
        label: string;
        code: string;
    };

    let {
        variants,
        selectedLang = $bindable()
    }: {
        variants: Variant[];
        selectedLang: string;
    } = $props();

    let activeVariant = $derived(
        variants.find((v) => v.lang === selectedLang) ?? variants[0]
    );
</script>

<CodeBlock code={activeVariant.code} lang={activeVariant.lang}>
    {#snippet header()}
        <div role="tablist" class="-mx-4 -mt-5 mb-4 flex border-b border-slate-700/80 sm:-mx-6 sm:-mt-6">
            {#each variants as variant (variant.lang)}
                <button
                    type="button"
                    role="tab"
                    aria-selected={variant.lang === activeVariant.lang}
                    class={[
                        'cursor-pointer border-b-2 px-4 py-2.5 text-xs font-medium transition focus-visible:bg-slate-800 focus-visible:text-slate-200 focus-visible:outline-none sm:px-5',
                        variant.lang === activeVariant.lang
                            ? 'border-brand-500 text-slate-200'
                            : 'border-transparent text-slate-500 hover:text-slate-300'
                    ]}
                    onclick={() => (selectedLang = variant.lang)}
                >
                    {variant.label}
                </button>
            {/each}
        </div>
    {/snippet}
</CodeBlock>
