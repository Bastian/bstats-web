<script lang="ts">
    import { resolve } from '$app/paths';
    import Badge from '$lib/components/Badge.svelte';
    import Button from '$lib/components/Button.svelte';
    import Checkbox from '$lib/components/Checkbox.svelte';
    import PageHero from '$lib/components/PageHero.svelte';
    import { authClient } from '$lib/auth.client.js';
    import type { SvelteHTMLElements } from 'svelte/elements';

    let error: string | undefined = $state(undefined);

    let { data } = $props();

    const handleFormSubmit: SvelteHTMLElements['form']['onsubmit'] = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const usernameOrEmail = formData.get('username') as string;

        let response:
            | Awaited<ReturnType<typeof authClient.signIn.username>>
            | Awaited<ReturnType<typeof authClient.signIn.email>>;

        if (usernameOrEmail.includes('@')) {
            response = await authClient.signIn.email({
                email: usernameOrEmail,
                password: formData.get('password') as string,
                rememberMe: !!formData.get('remember-me')
            });
        } else {
            response = await authClient.signIn.username({
                username: formData.get('username') as string,
                password: formData.get('password') as string,
                rememberMe: !!formData.get('remember-me')
            });
        }
        if (response.error) {
            error = response.error.message;
        } else {
            // Backend redirects to '/' automatically
        }
    };
</script>

<svelte:head>
    <meta name="description" content="Login into your bStats account." />
    <title>bStats - Login</title>
</svelte:head>

<main class="pb-24">
    <PageHero>
        {#snippet badge()}<Badge>Account</Badge>{/snippet}
        {#snippet title()}Welcome back{/snippet}
        {#snippet content()}
            Sign in to register plugins, add charts, and manage your bStats account.
        {/snippet}
    </PageHero>

    {#if data.session}
        You are already logged in.
    {:else}
        <section class="doc-container mt-12">
            <div class="form-card space-y-6">
                {#if error}
                    <div class="doc-callout border-rose-200 bg-rose-50 text-rose-700">
                        {error}
                    </div>
                {/if}

                <form
                    method="post"
                    class="space-y-5"
                    onsubmit={async (event) => handleFormSubmit(event)}
                >
                    <div class="input-group">
                        <label class="input-label" for="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            autocomplete="username"
                            class="input-control"
                            required
                        />
                    </div>
                    <div class="input-group">
                        <label class="input-label" for="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            autocomplete="current-password"
                            class="input-control"
                            required
                        />
                    </div>
                    <Checkbox id="remember-me" class="mt-1" label="Remember me" />
                    <Button fullWidth size="large" type="submit" name="btn_login">Sign in</Button>
                </form>

                <p class="text-center text-sm text-slate-500">
                    Don't have an account yet?
                    <a
                        class="font-semibold text-brand-600 hover:text-brand-700"
                        href={resolve('/register')}
                    >
                        Create one
                    </a>.
                </p>
            </div>
        </section>
    {/if}
</main>
