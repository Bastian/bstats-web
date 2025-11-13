<script lang="ts">
    import { resolve } from '$app/paths';
    import { authClient } from '$lib/auth.client.js';
    import Badge from '$lib/components/badge.svelte';
    import Button from '$lib/components/button.svelte';
    import { TextInput } from '$lib/components/input/text';
    import PageHero from '$lib/components/page-hero.svelte';

    let { data } = $props();

    let error = $state<string | undefined>(undefined);
    let currentPassword = $state('');
    let newPassword = $state('');
    let confirmPassword = $state('');

    let success = $state('');

    let hint = $derived.by(() => {
        if (error) {
            return { text: error, type: 'error' };
        }
        if (!currentPassword || !newPassword || !confirmPassword) {
            return { text: '', type: '' };
        }
        if (newPassword === confirmPassword) {
            return { text: 'Passwords match', type: 'success' };
        }
        return { text: 'Passwords do not match', type: 'error' };
    });

    let isFormValid = $derived(
        currentPassword.length > 0 && newPassword.length >= 8 && newPassword === confirmPassword
    );
</script>

<svelte:head>
    <meta name="description" content="Change your bStats account password." />
    <title>bStats - Change password</title>
</svelte:head>

<main class="pb-24">
    <PageHero>
        {#snippet badge()}<Badge>Account</Badge>{/snippet}
        {#snippet title()}Change password{/snippet}
        {#snippet content()}
            Use the form below to change your bStats account password.
        {/snippet}
    </PageHero>

    <section class="doc-container mt-12">
        <div class="form-card space-y-6">
            {#if success}
                <div class="doc-callout doc-callout-info">{success}</div>
                <Button href={resolve(`/author/${data.user?.name}`)} size="large" fullWidth>
                    Back to my page
                </Button>
            {:else}
                <form
                    method="post"
                    class="space-y-5"
                    onsubmit={async (event) => {
                        event.preventDefault();
                        const response = await authClient.changePassword({
                            currentPassword,
                            newPassword
                        });
                        if (response.error) {
                            error = response.error.message;
                        } else {
                            success = 'Your password has been changed successfully.';
                        }
                    }}
                >
                    <TextInput.Root>
                        <label for="current-password">Current password</label>
                        <TextInput.Input
                            id="current-password"
                            type="password"
                            name="currentPassword"
                            bind:value={currentPassword}
                            required
                        />
                    </TextInput.Root>
                    <TextInput.Root>
                        <label for="new-password">New password</label>
                        <TextInput.Input
                            id="new-password"
                            type="password"
                            autocomplete="new-password"
                            name="newPassword"
                            minlength={8}
                            bind:value={newPassword}
                            required
                        />
                        <p class="form-helper">Minimum 8 characters</p>
                    </TextInput.Root>
                    <TextInput.Root>
                        <label for="confirm-password">Confirm new password</label>
                        <TextInput.Input
                            id="confirm-password"
                            type="password"
                            name="confirmPassword"
                            bind:value={confirmPassword}
                            required
                        />
                        {#if hint.text}
                            <p
                                class="form-helper {hint.type === 'error'
                                    ? 'text-rose-600'
                                    : 'text-emerald-600'}"
                            >
                                {hint.text}
                            </p>
                        {/if}
                    </TextInput.Root>
                    <Button fullWidth size="large" type="submit" disabled={!isFormValid}>
                        Change password
                    </Button>
                </form>
                <a
                    href={resolve(`/author/${data.user?.name}`)}
                    class="block text-center text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                    Back to my page
                </a>
            {/if}
        </div>
    </section>
</main>
