<script lang="ts">
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
    import Badge from '$lib/components/badge.svelte';
    import Button from '$lib/components/button.svelte';
    import { TextInput } from '$lib/components/input/text';
    import PageHero from '$lib/components/page-hero.svelte';
    import { MetaTags } from 'svelte-meta-tags';
    import { getCanonicalUrl } from '$lib/utils/url';

    let { data, form } = $props();

    let username = $state(data.currentUsername);

    let hint = $derived.by(() => {
        if (form?.error) {
            return { text: form.error, type: 'error' };
        }
        if (!username?.trim()) {
            return { text: 'Username is required', type: 'error' };
        }
        if (username.toLowerCase() === data.currentUsername?.toLowerCase()) {
            return { text: 'Enter a different username', type: 'info' };
        }
        return { text: '', type: '' };
    });

    let isFormValid = $derived(
        username?.trim() && username.toLowerCase() !== data.currentUsername?.toLowerCase()
    );
</script>

<MetaTags
    title="Change username - bStats"
    description="Change your bStats account username."
    openGraph={{
        title: 'Change username',
        description: 'Change your bStats account username.',
        type: 'website',
        url: getCanonicalUrl(page.url),
        siteName: 'bStats',
        locale: 'en_US'
    }}
/>

<main class="pb-24">
    <PageHero>
        {#snippet badge()}<Badge>Account</Badge>{/snippet}
        {#snippet title()}Change username{/snippet}
        {#snippet content()}
            Use the form below to change your bStats account username.
        {/snippet}
    </PageHero>

    <section class="doc-container mt-12">
        <div class="form-card space-y-6">
            <form method="post" class="space-y-5">
                <TextInput.Root>
                    <label for="username">New username</label>
                    <TextInput.Input
                        id="username"
                        type="text"
                        name="username"
                        autocomplete="username"
                        bind:value={username}
                        required
                    />
                    {#if hint.text}
                        <p
                            class="form-helper {hint.type === 'error'
                                ? 'text-rose-600'
                                : 'text-gray-500'}"
                        >
                            {hint.text}
                        </p>
                    {/if}
                </TextInput.Root>
                <Button fullWidth size="large" type="submit" disabled={!isFormValid}>
                    Change username
                </Button>
            </form>
            <a
                href={resolve(`/author/${data.currentUsername}`)}
                class="block text-center text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
                Back to my page
            </a>
        </div>
    </section>
</main>
