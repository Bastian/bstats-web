<script lang="ts">
	import { resolve } from '$app/paths';
	import Badge from '$lib/components/Badge.svelte';
	import Button from '$lib/components/Button.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import { env } from '$env/dynamic/public';
	import HCaptcha from '$lib/components/HCaptcha.svelte';
	import { authClient } from '$lib/auth.client';

	let error = $state('');
	let sentVerificationEmail = $state(false);

	let token = $state<string | null>(null);

	let password = $state('');
	let confirmPassword = $state('');
	let email = $state('');
	let username = $state('');
	let privacyAccepted = $state(false);
	let passwordMismatch = $derived(confirmPassword.length > 0 && password !== confirmPassword);
	let isFormValid = $derived(
		password.length > 0 && password === confirmPassword && privacyAccepted && token
	);

	let captcha = $state<ReturnType<typeof HCaptcha> | undefined>();
</script>

<svelte:head>
	<meta name="description" content="Create a new bStats account." />
	<title>bStats - Register</title>
</svelte:head>

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
					A verification email has been sent to your email address. Please check your inbox and
					follow the instructions to verify your account.
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

						const sanitizedUsername = username
							.toLowerCase()
							.replace(/[^a-z0-9._-]/g, '-') // Replace invalid chars with hyphen
							.replace(/^[.-]+|[.-]+$/g, '') // Remove leading/trailing dots or hyphens
							.replace(/\.{2,}/g, '.') // Replace multiple dots with single dot
							.substring(0, 64); // Max length for email local part

						const fakeEmail = `${sanitizedUsername}@legacy-account.bstats.org`;

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
							error = response.error.message ?? 'An unknown error occurred during registration.';
							captcha?.reset();
							token = null;
						} else {
							// TODO Enable
							// sentVerificationEmail = true;
						}
					}}
				>
					<!-- TODO Enable
					<div class="input-group">
						<label class="input-label" for="email">Email</label>
						<input
							id="email"
							type="email"
							name="email"
							autocomplete="email"
							maxlength="256"
							class="input-control"
							bind:value={email}
							required
						/>
					</div>
					 -->
					<div class="input-group">
						<label class="input-label" for="username">Username</label>
						<input
							id="username"
							type="text"
							name="username"
							autocomplete="username"
							maxlength="32"
							class="input-control"
							bind:value={username}
							required
						/>
					</div>
					<div class="input-group">
						<label class="input-label" for="password">Password</label>
						<input
							id="password"
							type="password"
							name="password"
							autocomplete="new-password"
							class="input-control"
							bind:value={password}
							required
						/>
					</div>

					<div class="input-group">
						<label class="input-label" for="password_confirm">Confirm password</label>
						<input
							id="password_confirm"
							type="password"
							autocomplete="new-password"
							class="input-control"
							bind:value={confirmPassword}
							required
						/>
						{#if passwordMismatch}
							<p class="form-error">Passwords do not match.</p>
						{/if}
					</div>

					<label class="flex items-start gap-3 text-sm text-slate-600">
						<input
							type="checkbox"
							id="accept-privacy-policy"
							class="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
							bind:checked={privacyAccepted}
						/>
						<span>
							I accept the <a
								class="font-semibold text-brand-600 hover:text-brand-700"
								href={resolve('/privacy-policy')}>privacy policy</a
							>.</span
						>
					</label>

					<div class="flex justify-center">
						<HCaptcha
							bind:this={captcha}
							sitekey={env.PUBLIC_HCAPTCHA_SITE_KEY}
							size="normal"
							theme="light"
							bind:token
							onError={(err) => {
								console.error('hCaptcha error', err);
								error = 'An error occurred while verifying the captcha. Please try again later.';
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
					<a class="font-semibold text-brand-600 hover:text-brand-700" href={resolve('/login')}>
						Sign in
					</a>.
				</p>
			</div>
		{/if}
	</section>
</main>
