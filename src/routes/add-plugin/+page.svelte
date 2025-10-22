<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import Badge from '$lib/components/Badge.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import Button from '$lib/components/Button.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let captchaSolved = $state(false);
	let softwareSelected = $state('');
	let pluginName = $state('');

	let isFormValid = $derived(softwareSelected !== '' && pluginName.length > 0 && captchaSolved);

	onMount(() => {
		// Load reCAPTCHA script
		const script = document.createElement('script');
		script.src = 'https://www.google.com/recaptcha/api.js';
		script.async = true;
		script.defer = true;
		document.head.appendChild(script);

		// Set up global callback for reCAPTCHA
		(window as any).captchaSolved = function () {
			captchaSolved = true;
		};
	});
</script>

<svelte:head>
	<meta name="description" content="Add a plugin to bStats." />
	<title>bStats - Add plugin</title>
</svelte:head>

<main class="pb-24">
	<PageHero>
		{#snippet badge()}<Badge>Account</Badge>{/snippet}
		{#snippet title()}Register a plugin{/snippet}
		{#snippet content()}
			Pick the server software, choose a display name, and we'll generate a plugin ID. You'll use
			that ID when instantiating the Metrics class.
		{/snippet}
	</PageHero>

	<section class="doc-container mt-12">
		<div class="form-card space-y-6">
			{#if form?.error === 'failed'}
				<div class="doc-callout border-rose-200 bg-rose-50 text-rose-700">
					Something went wrong on our side. Please try again.
				</div>
			{:else if form?.error === 'alreadyAdded'}
				<div class="doc-callout border-rose-200 bg-rose-50 text-rose-700">
					You already added this plugin.
				</div>
			{:else if form?.error === 'wrongCaptcha'}
				<div class="doc-callout border-amber-200 bg-amber-50 text-amber-700">
					Please solve the captcha to continue.
				</div>
			{:else if form?.error === 'invalidName'}
				<div class="doc-callout border-rose-200 bg-rose-50 text-rose-700">Invalid plugin name!</div>
			{/if}

			<form method="post" class="space-y-5" use:enhance>
				<div class="input-group">
					<label class="input-label" for="software">Server software</label>
					<select
						id="software"
						name="software"
						class="input-control"
						bind:value={softwareSelected}
						required
					>
						<option value="" disabled>Select software</option>
						{#each data.allSoftware as software}
							{#if software.globalPlugin || (data.user != null && data.user.admin)}
								<option value={software.id}>{software.name}</option>
							{/if}
						{/each}
					</select>
				</div>

				<div class="input-group">
					<label class="input-label" for="pluginName">Plugin name</label>
					<input
						id="pluginName"
						type="text"
						name="pluginName"
						maxlength="32"
						pattern="^[-_a-zA-Z0-9]+(\s[-_a-zA-Z0-9]+)*$"
						class="input-control"
						placeholder="My Awesome Plugin"
						bind:value={pluginName}
						required
					/>
					<p class="form-helper">Letters, numbers, underscores. Spaces allowed between words.</p>
				</div>

				<div class="flex justify-center">
					<div
						class="g-recaptcha"
						data-sitekey={data.recaptchaPublicKey}
						data-callback="captchaSolved"
					></div>
				</div>

				<Button fullWidth size="large" buttonProps={{ type: 'submit' }} disabled={!isFormValid}>
					Add plugin
				</Button>
			</form>
		</div>
	</section>
</main>
