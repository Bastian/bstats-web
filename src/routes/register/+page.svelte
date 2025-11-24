<script lang="ts">
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
    import Badge from '$lib/components/badge.svelte';
    import Button from '$lib/components/button.svelte';
    import { Checkbox } from '$lib/components/input/checkbox';
    import PageHero from '$lib/components/page-hero.svelte';
    import { env } from '$env/dynamic/public';
    import HCaptcha from '$lib/components/h-captcha.svelte';
    import { authClient } from '$lib/auth.client';
    import { TextInput } from '$lib/components/input/text';
    import { MetaTags } from 'svelte-meta-tags';
    import { getCanonicalUrl } from '$lib/utils/url';

    let error = $state('');
    let sentVerificationEmail = $state(false);

    let token = $state<string | null>(null);

    let password = $state('');
    let confirmPassword = $state('');
    // TODO enable: let email = $state('');
    let username = $state('');
    let privacyAccepted = $state(false);
    let passwordMismatch = $derived(confirmPassword.length > 0 && password !== confirmPassword);
    let isFormValid = $derived(
        password.length > 0 && password === confirmPassword && privacyAccepted && token
    );

    let captcha = $state<ReturnType<typeof HCaptcha> | undefined>();
</script>

<MetaTags
    title="Register - bStats"
    description="Create an account to register plugins and add custom charts."
    openGraph={{
        title: 'Register',
        description: 'Create an account to register plugins and add custom charts.',
        type: 'website',
        url: getCanonicalUrl(page.url),
        siteName: 'bStats',
        locale: 'en_US'
    }}
/>

<main class="pb-24">
    <PageHero>
        {#snippet badge()}<Badge>Account</Badge>{/snippet}
        {#snippet title()}Create an account{/snippet}
        {#snippet content()}
            Create an account to register plugins and add custom charts.
        {/snippet}
    </PageHero>

    <section class="doc-container mt-12">
        {#if sentVerificationEmail}
            <div class="form-card">
                <div class="doc-callout doc-callout-info mb-8">
                    A verification email has been sent to your email address. Please check your
                    inbox and follow the instructions to verify your account.
                    <br /><br />
                    Make sure to also check your spam folder.
                </div>
                <Button href={resolve('/login')} size="large" fullWidth>Back to login</Button>
            </div>
        {:else}
            <div class="form-card space-y-6">
                {#if error}
                    <div class="doc-callout border-rose-200 bg-rose-50 text-rose-700">
                        {error}
                    </div>
                {/if}

                <form
                    id="registerForm"
                    method="post"
                    class="space-y-5"
                    onsubmit={async (event) => {
                        event.preventDefault();
                        if (!isFormValid) {
                            // Should not happen because the button is disabled when the form is invalid
                            return;
                        }

                        // better-auth requires an email, but we allow registration without one
                        const fakeEmail = `${Math.random().toString(36).substring(2, 12)}@internal.bstats.org`;

                        const response = await authClient.signUp.email({
                            email: fakeEmail, // TODO Replace with real email
                            password,
                            name: username,
                            username: username,
                            fetchOptions: {
                                headers: {
                                    'x-captcha-response': token!
                                }
                            }
                        });
                        if (response.error) {
                            error =
                                response.error.message ??
                                'An unknown error occurred during registration.';
                            captcha?.reset();
                            token = null;
                        } else {
                            // TODO Enable
                            // sentVerificationEmail = true;
                        }
                    }}
                >
                    <!-- TODO Enable
                     <TextInput.Root>
                        <label for="email">Email</label>
                        <TextInput.Input
                            id="email"
                            type="email"
                            name="email"
                            autocomplete="email"
                            maxlength={256}
                            bind:value={email}
                            required
                        />
                    </TextInput.Root>
					 -->
                    <TextInput.Root>
                        <label for="username">Username</label>
                        <TextInput.Input
                            id="username"
                            type="text"
                            name="username"
                            autocomplete="username"
                            maxlength={32}
                            bind:value={username}
                            required
                        />
                    </TextInput.Root>
                    <TextInput.Root>
                        <label for="password">Password</label>
                        <TextInput.Input
                            id="password"
                            type="password"
                            name="password"
                            autocomplete="new-password"
                            bind:value={password}
                            required
                        />
                    </TextInput.Root>
                    <TextInput.Root>
                        <label for="password_confirm">Confirm password</label>
                        <TextInput.Input
                            id="password_confirm"
                            type="password"
                            autocomplete="new-password"
                            bind:value={confirmPassword}
                            required
                        />
                        {#if passwordMismatch}
                            <p class="form-error">Passwords do not match.</p>
                        {/if}
                    </TextInput.Root>
                    <Checkbox.Root>
                        <Checkbox.Input id="accept-privacy-policy" bind:checked={privacyAccepted} />
                        <label for="accept-privacy-policy">
                            I accept the <a
                                class="font-semibold text-brand-600 hover:text-brand-700"
                                href={resolve('/privacy-policy')}>privacy policy</a
                            >.
                        </label>
                    </Checkbox.Root>

                    <div class="flex justify-center">
                        <HCaptcha
                            bind:this={captcha}
                            sitekey={env.PUBLIC_HCAPTCHA_SITE_KEY!}
                            size="normal"
                            theme="light"
                            bind:token
                            onError={(err) => {
                                console.error('hCaptcha error', err);
                                error =
                                    'An error occurred while verifying the captcha. Please try again later.';
                            }}
                        />
                    </div>

                    <Button
                        fullWidth
                        type="submit"
                        name="btn_register"
                        disabled={!isFormValid}
                        size="large"
                    >
                        Create account
                    </Button>
                </form>

                <p class="text-center text-sm text-slate-500">
                    Already have an account?
                    <a
                        class="font-semibold text-brand-600 hover:text-brand-700"
                        href={resolve('/login')}
                    >
                        Sign in
                    </a>.
                </p>
            </div>
        {/if}
    </section>
</main>
