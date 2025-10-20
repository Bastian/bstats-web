<script lang="ts">
	import { enhance } from '$app/forms';
	let { data, form } = $props();
</script>

<svelte:head>
	<meta name="description" content="Login into your bStats account." />
	<title>bStats - Login</title>
</svelte:head>

<main>
	<div class="container">
		<br /><br />
		<div class="hide-on-med-and-down"><br /><br /></div>
		<div class="row">
			{#if form?.failed}
				<h5 class="red-text col s12 center-align">Login failed! Please try again!</h5>
			{:else if form?.registered}
				<h5 class="{data.customColor1}-text col s12 center-align">
					Account created! Please log in now.
				</h5>
			{:else}
				<h5 class="{data.customColor1}-text col s12 center-align">
					Please, login into your account
				</h5>
			{/if}
			<br /><br />
			<div class="col s12 m8 l6 offset-m2 offset-l3 z-depth-1 grey lighten-4 row">
				<form class="col s12" method="post" use:enhance>
					<br />
					<!-- Name form -->
					<div class="row">
						<div class="input-field col s12">
							<input id="username" type="text" name="username" required />
							<label for="username">Name</label>
						</div>
					</div>
					<!-- Password form -->
					<div class="row">
						<div class="input-field col s12">
							<input id="password" type="password" name="password" required />
							<label for="password">Password</label>
						</div>
					</div>
					<br />
					<!-- Login button -->
					<div class="row">
						<button
							type="submit"
							name="btn_login"
							class="col s12 btn btn-large waves-effect {data.customColor1}"
						>
							Login
						</button>
					</div>
				</form>
			</div>

			<a href="/register" class="col s12 center-align">Create account</a>
		</div>
	</div>
</main>
