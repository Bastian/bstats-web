<script lang="ts">
	import { resolve } from '$app/paths';
	import Badge from '$lib/components/Badge.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import type { PageProps } from './$types';
	import BuildToolSelectStep, { type BuildTool } from './BuildToolSelectStep.svelte';
	import IncludeMetricsStep from './IncludeMetricsStep.svelte';
	import InstantiateMetricsStep from './InstantiateMetricsStep.svelte';
	import PlatformSelectStep, { type Platform } from './PlatformSelectStep.svelte';
	import RegisterPluginStep from './RegisterPluginStep.svelte';
	import WizardStep from './WizardStep.svelte';
	import IconArrowRight from '@tabler/icons-svelte/icons/arrow-right';

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
				buildTool={selectedBuildTool}
				bind:metricsInstantiated
				status={metricsInstantiated ? 'done' : metricsIncluded ? 'active' : 'locked'}
			/>

			<WizardStep index={6} title="Done" status={metricsInstantiated ? 'done' : 'locked'}>
				<p class="max-w-prose">You have successfully included bStats Metrics in your plugin.</p>

				<div class="doc-callout doc-callout-info mt-4">
					<p class="text-sm font-semibold text-slate-800">When will data show up?</p>
					<p class="mt-2 max-w-prose text-sm text-slate-600">
						After the server starts, the first data is sent after a random 3-6 minute delay. The
						site publishes updates at hh:00 and hh:30, so once data is sent it may take up to 30
						minutes to become visible.
					</p>
				</div>

				<div class="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
					<h3 class="text-sm font-semibold text-slate-800">What's next?</h3>
					<p class="mt-2 max-w-prose text-sm text-slate-600">
						Beyond the default metrics, you can track custom data specific to your plugin with
						custom charts. Add pie charts for configuration options, line charts for trends, or bar
						charts for feature adoption.
					</p>
					<a
						href={resolve('/docs/custom-charts')}
						class="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
					>
						Learn about custom charts
						<IconArrowRight size={18} />
					</a>
				</div>

				{#if plugin}
					<div class="mt-6">
						<a
							href={resolve(`/plugin/${plugin.platform}/${plugin.pluginName}/${plugin.pluginId}`)}
							class="inline-block text-sm font-semibold text-brand-600 underline hover:text-brand-800"
						>
							View your plugin on bStats <IconArrowRight size={18} />
						</a>
					</div>
				{/if}
			</WizardStep>
		</div>
	</section>
</main>
