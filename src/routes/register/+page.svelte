<script lang="ts">
	import { resolve } from '$app/paths';
	import Badge from '$lib/components/Badge.svelte';
	import Button from '$lib/components/Button.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import { onMount } from 'svelte';

	let { data, form } = $props();

	let password = $state('');
	let confirmPassword = $state('');
	let username = $state('');
	let privacyAccepted = $state(false);
	let captchaSolved = $state(false);
	let passwordMismatch = $derived(confirmPassword.length > 0 && password !== confirmPassword);
	let isFormValid = $derived(
		password.length > 0 &&
			password === confirmPassword &&
			usernamePattern.test(username) &&
			captchaSolved &&
			privacyAccepted
	);

	const usernamePattern = /^[-_a-zA-Z0-9]+(\s[-_a-zA-Z0-9]+)*$/;

	onMount(() => {
		// @ts-ignore
		window.correctCaptcha = function () {
			captchaSolved = true;
		};
	});
</script>

<svelte:head>
	<meta name="description" content="Create a new bStats account." />
	<title>bStats - Register</title>
	<script src="https://www.google.com/recaptcha/api.js" async defer></script>
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
		<div class="form-card space-y-6">
			{#if form?.failed}
				<div class="doc-callout border-rose-200 bg-rose-50 text-rose-700">
					This username is already taken. Choose another one to continue.
				</div>
			{:else if form?.wrongCaptcha}
				<div class="doc-callout border-amber-200 bg-amber-50 text-amber-700">
					Please solve the captcha to prove you are not a robot.
				</div>
			{/if}

			<form id="registerForm" method="post" class="space-y-5">
				<div class="input-group">
					<label class="input-label" for="username">Username</label>
					<input
						id="username"
						type="text"
						name="username"
						autocomplete="username"
						pattern="^[-_a-zA-Z0-9]+(\\s[-_a-zA-Z0-9]+)*$"
						maxlength="32"
						class="input-control"
						bind:value={username}
						required
					/>
					<p class="form-helper">Letters, numbers, underscores. Spaces allowed between words.</p>
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
					<span
						>I accept the <a
							class="font-semibold text-brand-600 hover:text-brand-700"
							href={resolve('/privacy-policy')}>privacy policy</a
						>.</span
					>
				</label>

				<div class="flex justify-center">
					<div
						class="g-recaptcha"
						data-sitekey={data.publicKey}
						data-callback="correctCaptcha"
					></div>
				</div>

				<Button
					fullWidth
					buttonProps={{ type: 'submit', name: 'btn_register' }}
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
	</section>
</main>
