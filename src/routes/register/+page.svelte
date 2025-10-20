<script lang="ts">
	import { enhance } from '$app/forms';
	let { data, form } = $props();
</script>

<svelte:head>
	<meta name="description" content="Create a new bStats account." />
	<title>bStats - Register</title>
	<script src="https://www.google.com/recaptcha/api.js"></script>
</svelte:head>

<main>
	<div class="container">
		<br /><br />
		<div class="hide-on-med-and-down"><br /><br /></div>
		<div class="row">
			{#if form?.failed}
				<h5 class="red-text col s12 center-align">
					There's already an account with this name!
				</h5>
			{:else if form?.wrongCaptcha}
				<h5 class="red-text col s12 center-align">Please solve the captcha!</h5>
			{:else}
				<h5 class="{data.customColor1}-text col s12 center-align">Register an account</h5>
			{/if}
			<br /><br />
			<div class="col s12 m8 l6 offset-m2 offset-l3 z-depth-1 grey lighten-4 row">
				<form class="col s12" method="post" use:enhance>
					<br />
					<!-- Name -->
					<div class="row">
						<div class="input-field col s12">
							<input
								id="username"
								type="text"
								name="username"
								pattern="^[-_a-zA-Z0-9]+(\s[-_a-zA-Z0-9]+)*$"
								maxlength="32"
								class="validate"
								required
							/>
							<label for="username" data-error="Invalid username">Name</label>
						</div>
					</div>
					<!-- Password -->
					<div class="row">
						<div class="input-field col s12">
							<input id="password" type="password" name="password" required />
							<label for="password">Password</label>
						</div>
					</div>
					<!-- reCAPTCHA -->
					<div class="row center-align">
						<div
							class="g-recaptcha"
							data-sitekey={data.publicKey}
							style="display: inline-block;"
						></div>
					</div>
					<br />
					<!-- Register button -->
					<div class="row">
						<button
							type="submit"
							name="btn_register"
							class="col s12 btn btn-large waves-effect {data.customColor1}"
						>
							Register
						</button>
					</div>
				</form>
			</div>

			<a href="/login" class="col s12 center-align">Already have an account?</a>
		</div>
	</div>
</main>
