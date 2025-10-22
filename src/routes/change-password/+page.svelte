<script lang="ts">
	import { resolve } from '$app/paths';
	import Badge from '$lib/components/Badge.svelte';
	import Button from '$lib/components/Button.svelte';
	import PageHero from '$lib/components/PageHero.svelte';

	let { data, form } = $props();

	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');

	let hint = $derived.by(() => {
		if (!currentPassword || !newPassword || !confirmPassword) {
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

	let isFormValid = $derived(
		currentPassword.length > 0 && newPassword.length >= 6 && newPassword === confirmPassword
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
			{#if form?.error}
				<div class="doc-callout border-rose-200 bg-rose-50 text-rose-700">{form.error}</div>
			{:else if form?.success}
				<div class="doc-callout doc-callout-info">{form.success}</div>
				<Button href={resolve(`/author/${data.user.username}`)} size="large" fullWidth
					>Back to my page</Button
				>
			{:else}
				<form method="post" class="space-y-5">
					<div class="input-group">
						<label class="input-label" for="currentPassword">Current password</label>
						<input
							id="currentPassword"
							type="password"
							name="currentPassword"
							class="input-control"
							bind:value={currentPassword}
							required
						/>
					</div>
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
					<Button fullWidth size="large" buttonProps={{ type: 'submit' }} disabled={!isFormValid}>
						Change password
					</Button>
				</form>
				<a
					href={resolve(`/author/${data.user.username}`)}
					class="block text-center text-sm font-semibold text-brand-600 hover:text-brand-700"
					>Back to my page</a
				>
			{/if}
		</div>
	</section>
</main>
