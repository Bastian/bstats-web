<script lang="ts">
	import { resolve } from '$app/paths';
	import Badge from '$lib/components/Badge.svelte';
	import Button from '$lib/components/Button.svelte';
	import PageHero from '$lib/components/PageHero.svelte';

	let { data, form } = $props();
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

	<section class="doc-container mt-12">
		<div class="form-card space-y-6">
			{#if form?.error}
				<div class="doc-callout border-rose-200 bg-rose-50 text-rose-700">
					Login failed. Double-check your username and password and try again.
				</div>
			{:else if data.registered}
				<div class="doc-callout doc-callout-info">
					Account created successfully. You can sign in below.
				</div>
			{/if}

			<form method="post" class="space-y-5">
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
				<Button fullWidth size="large" buttonProps={{ type: 'submit', name: 'btn_login' }}
					>Sign in</Button
				>
			</form>

			<p class="text-center text-sm text-slate-500">
				Don't have an account yet?
				<a class="font-semibold text-brand-600 hover:text-brand-700" href={resolve('/register')}>
					Create one
				</a>.
			</p>
		</div>
	</section>
</main>
