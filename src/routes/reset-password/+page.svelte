<script lang="ts">
	import { resolve } from '$app/paths';
	import Badge from '$lib/components/Badge.svelte';
	import Button from '$lib/components/Button.svelte';
	import PageHero from '$lib/components/PageHero.svelte';

	let { data, form } = $props();

	let newPassword = $state('');
	let confirmPassword = $state('');

	let hint = $derived.by(() => {
		if (!newPassword || !confirmPassword) {
			return { text: '', type: '' };
		}
		if (newPassword.length < 6) {
			return { text: 'Password must be at least 6 characters', type: 'error' };
		}
		if (newPassword === confirmPassword) {
			return { text: 'Passwords match', type: 'success' };
		}
		return { text: 'Passwords do not match', type: 'error' };
	});

	let isFormValid = $derived(newPassword.length >= 6 && newPassword === confirmPassword);
</script>

<svelte:head>
	<meta name="description" content="Reset your bStats account password." />
	<title>bStats - Reset password</title>
</svelte:head>

<main class="pb-24">
	<PageHero>
		{#snippet badge()}<Badge>Account</Badge>{/snippet}
		{#snippet title()}Reset password{/snippet}
		{#snippet content()}
			You can use the form below to reset your bStats account password.
		{/snippet}
	</PageHero>

	<section class="doc-container mt-12">
		<div class="form-card space-y-6">
			{#if form?.error}
				<div class="doc-callout border-rose-200 bg-rose-50 text-rose-700">{form.error}</div>
			{:else if form?.success}
				<div class="doc-callout doc-callout-info">{form.success}</div>
				<Button href={resolve('/login')} fullWidth>Go to login</Button>
			{:else if data.token}
				<form method="post" class="space-y-5">
					<input type="hidden" name="token" value={data.token} />
					{#if data.username}
						<p class="text-sm text-slate-500">
							Resetting password for <span class="font-semibold text-slate-900">
								{data.username}
							</span>
						</p>
					{/if}
					<div class="input-group">
						<label class="input-label" for="newPassword">New password</label>
						<input
							id="newPassword"
							type="password"
							name="newPassword"
							class="input-control"
							minlength="6"
							bind:value={newPassword}
							required
						/>
						<p class="form-helper">Minimum 6 characters</p>
					</div>
					<div class="input-group">
						<label class="input-label" for="confirmPassword">Confirm password</label>
						<input
							id="confirmPassword"
							type="password"
							name="confirmPassword"
							class="input-control"
							bind:value={confirmPassword}
							required
						/>
						{#if hint.text}
							<p class="form-helper {hint.type === 'error' ? 'text-rose-600' : 'text-emerald-600'}">
								{hint.text}
							</p>
						{/if}
					</div>
					<Button fullWidth type="submit" disabled={!isFormValid} size="large">
						Reset password
					</Button>
				</form>
			{:else}
				<div class="doc-callout doc-callout-note">
					Need a reset link? Reach out to us via mail or Discord.
				</div>
				<Button href={resolve('/login')} fullWidth>Back to login</Button>
			{/if}
		</div>
	</section>
</main>
