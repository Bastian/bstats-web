<script lang="ts" module>
	import type { Session } from 'better-auth';
	import type { Platform } from './PlatformSelectStep.svelte';

	export type RegisterPluginStepProps = {
		session: Session | null;
		platform: Platform | null;
		status: StepStatus;
		pluginCreationSkipped: boolean;
		form: ActionData;
	};
</script>

<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import WizardStep, { type StepStatus } from './WizardStep.svelte';
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import IconArrowRight from '@tabler/icons-svelte/icons/arrow-right';

	const alertId = $props.id();

	let {
		session,
		platform,
		status,
		pluginCreationSkipped = $bindable(),
		form
	}: RegisterPluginStepProps = $props();
</script>

{#snippet SkipButton()}
	{#if !form?.pluginId}
		{#if !pluginCreationSkipped}
			<button
				type="button"
				class="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-800"
				onclick={() => (pluginCreationSkipped = true)}
			>
				Skip for now <IconArrowRight size={16} />
			</button>
		{:else}
			<p aria-live="polite" class="text-sm text-brand-600">
				Skipped. You can come back later to register your plugin.
			</p>
		{/if}
	{/if}
{/snippet}

<WizardStep index={2} title="Register plugin" {status}>
	<p class="max-w-prose">
		{#if session}
			Register your plugin on bStats. You can skip this step if you already added your plugin.
		{:else}
			You need to be logged in to register your plugin. You can skip this step if you want to read
			on or already added your plugin.
		{/if}
	</p>
	{#if !form?.pluginId && platform && session}
		<form method="post" action="?/addPlugin" class="mt-8" use:enhance>
			<div class="input-group">
				<label class="input-label" for="pluginName">Plugin name</label>
				<input
					id="pluginName"
					type="text"
					name="pluginName"
					maxlength="48"
					class="input-control"
					placeholder="My Awesome Plugin"
					required
					{...['missingData', 'duplicatePlugin', 'invalidName'].includes(form?.error ?? '')
						? { 'aria-invalid': 'true', 'aria-describedby': alertId }
						: {}}
				/>
			</div>
			<input type="hidden" name="platform" value={platform} />
			<div class="mt-4 flex flex-wrap items-center gap-3">
				<Button type="submit" size="large">Register plugin</Button>
				{@render SkipButton()}
			</div>
			{#snippet Alert(message: string)}
				<p role="alert" class="mt-4 text-sm text-red-600">
					{message}
				</p>
			{/snippet}
			{#if form?.error === 'missingData'}
				{@render Alert('Please fill out all required fields.')}
			{:else if form?.error === 'duplicatePlugin'}
				{@render Alert('A plugin with this name already exists on the selected platform.')}
			{:else if form?.error === 'invalidName'}
				{@render Alert(
					'Invalid plugin name. Please avoid special characters and keep it under 48 characters.'
				)}
			{:else if form?.error}
				{@render Alert(`An unknown error occurred: ${form.error}`)}
			{/if}
		</form>
	{/if}

	{#if !form?.pluginId && platform && !session}
		<div>
			<div class="mt-6 flex flex-wrap items-center gap-3">
				<Button href={resolve('/login')} size="small">Login</Button>
				<a
					class="inline-flex items-center text-sm font-semibold text-brand-600 transition hover:text-brand-700"
					href={resolve('/register')}
				>
					Create an account
				</a>
			</div>
			<div class="mt-6">
				{@render SkipButton()}
			</div>
		</div>
	{/if}

	{#if form?.pluginId}
		<div id={alertId} role="alert" class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
			<h3 class="font-semibold text-slate-900">Plugin registered successfully!</h3>
			<p class="mt-2 text-sm text-slate-600">
				Your plugin "<span class="font-medium">{form.pluginName}</span>" has been registered with
				the ID <span class="font-medium">{form.pluginId}</span>.
			</p>
		</div>
	{/if}
</WizardStep>
