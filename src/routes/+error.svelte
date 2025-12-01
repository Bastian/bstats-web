<script lang="ts">
    import { page } from '$app/stores';
    import { resolve } from '$app/paths';
    import Badge from '$lib/components/badge.svelte';
    import Button from '$lib/components/button.svelte';
    import PageHero from '$lib/components/page-hero.svelte';
    import { MetaTags } from 'svelte-meta-tags';

    // Access error from page store
    let errorStatus = $derived($page.status);
    let errorMessage = $derived($page.error?.message || 'An unexpected error occurred');
    let is404 = $derived(errorStatus === 404);
</script>

<MetaTags title="{is404 ? 'Page not found' : 'Error'} - bStats" description="Error page" />

<div>
    <PageHero>
        {#snippet badge()}
            <Badge type="error">{errorStatus || 'Error'}</Badge>
        {/snippet}
        {#snippet title()}
            {#if is404}
                Page not found
            {:else}
                {errorMessage}
            {/if}
        {/snippet}
        {#snippet content()}
            {#if is404}
                We can't find the page you're looking for. It might have moved or never existed.
            {:else}
                An unexpected error occurred. If the problem persists, please let us know.
            {/if}
        {/snippet}
        {#snippet extra()}
            <div class="mt-6 flex flex-wrap justify-center gap-3">
                <Button href={resolve('/')} size="large">Go home</Button>
            </div>
        {/snippet}
    </PageHero>

    {#if !is404 && import.meta.env.DEV && ($page.error as Error)?.stack}
        <section class="doc-container mt-12 mb-24">
            <div class="doc-card space-y-3">
                <h2 class="doc-card-title">Debug details</h2>
                <pre class="overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
					{($page.error as Error).stack}
				</pre>
            </div>
        </section>
    {/if}
</div>
