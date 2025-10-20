<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');

	let passwordsMatch = $derived(
		confirmPassword === '' ? null : newPassword === confirmPassword
	);
	let isFormValid = $derived(
		currentPassword !== '' &&
			newPassword.length >= 6 &&
			confirmPassword !== '' &&
			passwordsMatch === true
	);

	let passwordHelper = $derived(
		confirmPassword === ''
			? ''
			: passwordsMatch
				? 'Passwords match'
				: 'Passwords do not match'
	);

	let passwordHelperClass = $derived(
		passwordsMatch === null ? '' : passwordsMatch ? 'green-text' : 'red-text'
	);
</script>

<svelte:head>
	<title>bStats - Change Password</title>
	<meta name="description" content="Change your bStats account password." />
</svelte:head>

<main>
	<div class="container">
		<br /><br />
		<div class="hide-on-med-and-down"><br /><br /></div>
		<div class="row">
			{#if form?.error}
				<h5 class="red-text col s12 center-align">{form.error}</h5>
			{:else if form?.success}
				<h5 class="green-text col s12 center-align">{form.success}</h5>
			{:else}
				<h5 class="{data.customColor1}-text col s12 center-align">Change your password</h5>
			{/if}
			<br /><br />
			<div class="col s12 m8 l6 offset-m2 offset-l3 z-depth-1 grey lighten-4 row">
				<form class="col s12" method="post" use:enhance>
					<br />
					<!-- Current Password -->
					<div class="row">
						<div class="input-field col s12">
							<input
								id="currentPassword"
								type="password"
								name="currentPassword"
								bind:value={currentPassword}
								required
							/>
							<label for="currentPassword">Current Password</label>
						</div>
					</div>
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
							<span
								class="helper-text"
								data-error="Password must be at least 6 characters"
								data-success="Valid">Minimum 6 characters</span
							>
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
							<span class="helper-text {passwordHelperClass}">{passwordHelper}</span>
						</div>
					</div>
					<br />
					<!-- Change Password button -->
					<div class="row">
						<button
							type="submit"
							name="btn_change_password"
							class="col s12 btn btn-large waves-effect {data.customColor1}"
							disabled={!isFormValid}
						>
							Change Password
						</button>
					</div>
				</form>
			</div>

			<a href="/author/{data.user.username}" class="col s12 center-align">Back to My Page</a>
		</div>
	</div>
</main>
