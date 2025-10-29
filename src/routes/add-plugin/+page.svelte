<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import type { PageProps } from './$types';
	import BuildToolSelectStep, { type BuildTool } from './BuildToolSelectStep.svelte';
	import IncludeMetricsStep from './IncludeMetricsStep.svelte';
	import InstantiateMetricsStep from './InstantiateMetricsStep.svelte';
	import PlatformSelectStep, { type Platform } from './PlatformSelectStep.svelte';
	import RegisterPluginStep from './RegisterPluginStep.svelte';
	import WizardStep from './WizardStep.svelte';

	let { data, form }: PageProps = $props();

	let selectedPlatform = $state<Platform | null>(null);
	let pluginCreationSkipped = $state<boolean>(false);
	let plugin = $derived.by(() => {
		if (!form || form.error) {
			return undefined;
		}

		return {
			platform: form.platform!,
			pluginName: form.pluginName!,
			pluginId: form.pluginId!
		};
	});
	let selectedBuildTool = $state<BuildTool | null>(null);
	let metricsIncluded = $state<boolean>(false);
	let metricsInstantiated = $state<boolean>(false);
</script>

<svelte:head>
	<title>bStats - Add plugin</title>
	<meta
		name="description"
		content="Follow the step-by-step guide to add bStats Metrics to your plugin."
	/>
</svelte:head>

<main class="pb-24">
	<PageHero>
		{#snippet badge()}<Badge>Documentation</Badge>{/snippet}
		{#snippet title()}Add Plugin{/snippet}
		{#snippet content()}
			A guided flow for including bStats into your plugin. Pick the platform, register the plugin,
			add the bStats dependency and instantiate the Metrics class in your code.
		{/snippet}
	</PageHero>

	<section class="doc-container mt-12 space-y-8">
		<div class="space-y-6">
			<PlatformSelectStep bind:selectedPlatform editable={!plugin || pluginCreationSkipped} />

			<RegisterPluginStep
				bind:pluginCreationSkipped
				platform={selectedPlatform}
				{form}
				session={data.session}
				status={plugin || pluginCreationSkipped ? 'done' : selectedPlatform ? 'active' : 'locked'}
			/>

			<BuildToolSelectStep
				bind:selectedBuildTool
				status={selectedBuildTool ? 'done' : plugin || pluginCreationSkipped ? 'active' : 'locked'}
			/>

			<IncludeMetricsStep
				platform={selectedPlatform}
				buildTool={selectedBuildTool}
				bind:metricsIncluded
				status={metricsIncluded ? 'done' : selectedBuildTool ? 'active' : 'locked'}
			/>

			<InstantiateMetricsStep
				platform={selectedPlatform}
				{plugin}
				bind:metricsInstantiated
				status={metricsInstantiated ? 'done' : metricsIncluded ? 'active' : 'locked'}
			/>

			<WizardStep index={6} title="Done" status={metricsInstantiated ? 'done' : 'locked'}>
				<p class="max-w-prose">You have successfully included bStats Metrics in your plugin.</p>
				{#if metricsInstantiated}
					<div class="doc-callout doc-callout-info mt-4">
						<p class="text-sm font-semibold text-slate-800">When will data show up?</p>
						<p class="mt-2 max-w-prose text-sm text-slate-600">
							After the server starts, the first data is sent after a random 3-6 minute delay. The
							site publishes updates at hh:00 and hh:30, so once data is sent it may take up to 30
							minutes to become visible.
						</p>
					</div>
				{/if}
			</WizardStep>
		</div>
	</section>
</main>
