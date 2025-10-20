<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	onMount(() => {
		// Initialize Materialize select
		if (typeof window !== 'undefined' && window.$) {
			(window.$ as any)('select').material_select();
		}

		// Load reCAPTCHA script
		const script = document.createElement('script');
		script.src = 'https://www.google.com/recaptcha/api.js';
		script.async = true;
		script.defer = true;
		document.head.appendChild(script);
	});

	let errorMessage = $derived(
		form?.error === 'failed'
			? 'Something went wrong on our side :('
			: form?.error === 'alreadyAdded'
				? 'Plugin already added!'
				: form?.error === 'wrongCaptcha'
					? 'Please solve the captcha!'
					: form?.error === 'invalidName'
						? 'Invalid plugin name!'
						: null
	);
</script>

<svelte:head>
	<title>bStats - Add plugin</title>
	<meta name="description" content="Add a plugin to bStats." />
</svelte:head>

<main>
	<div class="container">
		<br /><br />
		<div class="hide-on-med-and-down"><br /><br /></div>
		<div class="row">
			{#if errorMessage}
				<h5 class="red-text col s12 center-align">{errorMessage}</h5>
			{:else}
				<h5 class="{data.customColor1}-text col s12 center-align">Add plugin</h5>
			{/if}
			<br /><br />
			<div class="col s12 m8 l6 offset-m2 offset-l3 z-depth-1 grey lighten-4 row">
				<form class="col s12" method="post" use:enhance>
					<br />
					<div class="row">
						<!-- Server software -->
						<div class="input-field col s12">
							<select id="software" name="software" required>
								<option value="" disabled selected>Select software</option>
								{#each data.allSoftware as software}
									<option value={software.id}>{software.name}</option>
								{/each}
							</select>
							<label>Select server software</label>
						</div>
						<!-- Name -->
						<div class="input-field col s12">
							<input
								id="pluginName"
								type="text"
								name="pluginName"
								pattern="^[-_a-zA-Z0-9]+(\s[-_a-zA-Z0-9]+)*$"
								maxlength="32"
								class="validate"
								required
							/>
							<label for="pluginName" data-error="Invalid plugin name">Plugin name</label>
						</div>
					</div>
					<div style="text-align: center">
						<div class="g-recaptcha" style="display: inline-block" data-sitekey={data.recaptchaPublicKey}></div>
					</div>
					<br />
					<!-- Add plugin button -->
					<div class="row">
						<button
							type="submit"
							name="btn_add_plugin"
							class="col s12 btn btn-large waves-effect {data.customColor1}"
						>
							Add plugin
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</main>
