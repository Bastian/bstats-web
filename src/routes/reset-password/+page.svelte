<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let newPassword = $state('');
	let confirmPassword = $state('');
	let passwordMatchHelper = $state('');
	let passwordMatchClass = $state('');
	let submitDisabled = $state(true);

	function checkPasswordsMatch() {
		if (confirmPassword === '') {
			passwordMatchHelper = '';
			passwordMatchClass = '';
			submitDisabled = true;
			return;
		}

		if (newPassword === confirmPassword) {
			passwordMatchHelper = 'Passwords match';
			passwordMatchClass = 'green-text';
			submitDisabled = false;
		} else {
			passwordMatchHelper = 'Passwords do not match';
			passwordMatchClass = 'red-text';
			submitDisabled = true;
		}
	}

	// Watch for password changes
	$effect(() => {
		newPassword;
		confirmPassword;
		checkPasswordsMatch();
	});

	onMount(() => {
		// Initialize Materialize components
		if (typeof window !== 'undefined' && window.Materialize) {
			window.Materialize.updateTextFields();
		}
	});
</script>

<svelte:head>
	<title>bStats - Reset Password</title>
	<meta name="description" content="Reset your bStats account password." />
</svelte:head>

<div class="container">
	<br /><br />
	<div class="hide-on-med-and-down"><br /><br /></div>
	<div class="row">
		{#if form?.error || data.error}
			<h5 class="red-text col s12 center-align">{form?.error || data.error}</h5>
		{:else if data.success}
			<h5 class="green-text col s12 center-align">{data.success}</h5>
			<br /><br />
			<div class="col s12 center-align">
				<a href="/login" class="btn {data.customColor1}">Go to Login</a>
			</div>
		{:else}
			<h5 class="{data.customColor1}-text col s12 center-align">Reset your password</h5>
		{/if}

		{#if !data.success && (data.token || form?.token)}
			<br /><br />
			<div class="col s12 m8 l6 offset-m2 offset-l3 z-depth-1 grey lighten-4 row">
				<form class="col s12" method="POST" use:enhance>
					<br />
					<input type="hidden" name="token" value={data.token || form?.token} />

					{#if data.username}
						<div class="row">
							<div class="col s12">
								<p class="center-align">
									Resetting password for user: <strong>{data.username}</strong>
								</p>
							</div>
						</div>
					{/if}

					<!-- New Password -->
					<div class="row">
						<div class="input-field col s12">
							<input
								id="newPassword"
								type="password"
								name="newPassword"
								bind:value={newPassword}
								required
								minlength="6"
							/>
							<label for="newPassword">New Password</label>
							<span class="helper-text">Minimum 6 characters</span>
						</div>
					</div>

					<!-- Confirm New Password -->
					<div class="row">
						<div class="input-field col s12">
							<input
								id="confirmPassword"
								type="password"
								name="confirmPassword"
								bind:value={confirmPassword}
								required
							/>
							<label for="confirmPassword">Confirm New Password</label>
							<span class="helper-text {passwordMatchClass}">{passwordMatchHelper}</span>
						</div>
					</div>

					<br />

					<!-- Reset Password button -->
					<div class="row">
						<button
							type="submit"
							class="col s12 btn btn-large waves-effect {data.customColor1}"
							disabled={submitDisabled}
						>
							Reset Password
						</button>
					</div>
				</form>
			</div>
		{/if}

		{#if !data.token && !form?.token && !data.success}
			<br /><br />
			<div class="col s12 center-align">
				<p>If you need to reset your password, please contact an administrator.</p>
				<a href="/login" class="btn {data.customColor1}">Back to Login</a>
			</div>
		{/if}
	</div>
</div>
