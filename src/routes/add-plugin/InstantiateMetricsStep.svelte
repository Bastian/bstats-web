<script lang="ts" module>
	import type { Platform } from './PlatformSelectStep.svelte';
	import type { StepStatus } from './WizardStep.svelte';
	import instantiateBukkit from './_instantiate-bukkit.txt?raw';
	import instantiateBungeeCord from './_instantiate-bungeecord.txt?raw';
	import instantiateSponge from './_instantiate-sponge.txt?raw';
	import instantiateVelocity from './_instantiate-velocity.txt?raw';

	export type InstantiateMetricsStepProps = {
		platform: Platform | null;
		status: StepStatus;
		buildTool: BuildTool | null;
		plugin?: {
			pluginName: string;
			pluginId: number;
		};
		metricsInstantiated?: boolean;
	};
</script>

<script lang="ts">
	import WizardStep from './WizardStep.svelte';
	import Button from '$lib/components/Button.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import type { BuildTool } from './BuildToolSelectStep.svelte';
	import type { ShikiTransformer } from 'shiki';

	let {
		platform,
		status,
		buildTool,
		plugin,
		metricsInstantiated = $bindable()
	}: InstantiateMetricsStepProps = $props();

	function processCode(code: string): string {
		return (
			code
				.replace('{{platform}}', platform ?? 'unknown')
				.replace(
					'{{pluginId}}',
					!plugin ? '/* INSERT PLUGIN ID HERE */' : plugin.pluginId.toFixed(0)
				)
				// On copy-and-paste Metrics classes, custom charts are inner classes of Metrics
				.replace(
					'Metrics.SimplePie',
					buildTool === 'copy-and-paste' ? 'Metrics.SimplePie' : 'SimplePie'
				)
		);
	}

	const codeTransformers: ShikiTransformer[] = [
		{
			name: 'highlight-placeholder-comment',
			postprocess(html) {
				// Highlight the placeholder comment in green and bold
				return html.replace(
					/\/\* INSERT PLUGIN ID HERE \*\//g,
					'<span class="font-bold text-green-400">/* INSERT PLUGIN ID HERE */</span>'
				);
			}
		}
	];
</script>

<WizardStep index={5} title="Instantiate Metrics" {status}>
	{#if (status === 'active' || status === 'done') && platform}
		{#if platform === 'bukkit'}
			<div class="space-y-4">
				<p class="max-w-prose">
					Instantiate the Metrics class in your plugin's
					<code class="font-mono text-slate-700">onEnable()</code>
					method.
				</p>
				<CodeBlock
					code={processCode(instantiateBukkit)}
					lang="java"
					transformers={codeTransformers}
				/>
			</div>
		{:else if platform === 'bungeecord'}
			<div class="space-y-4">
				<p class="max-w-prose">
					Instantiate the Metrics class in your plugin's
					<code class="font-mono text-slate-700">onEnable()</code>
					method.
				</p>
				<CodeBlock
					code={processCode(instantiateBungeeCord)}
					lang="java"
					transformers={codeTransformers}
				/>
			</div>
		{:else if platform === 'sponge'}
			<div class="space-y-4">
				<p class="max-w-prose">
					Use dependency injection to get a
					<code class="font-mono text-slate-700">Metrics.Factory</code>
					instance. Then instantiate the Metrics class in your plugin's
					<code class="font-mono text-slate-700">onServerStart(...)</code> method.
				</p>
				<CodeBlock
					code={processCode(instantiateSponge)}
					lang="java"
					transformers={codeTransformers}
				/>
			</div>
		{:else if platform === 'velocity'}
			<div class="space-y-4">
				<p class="max-w-prose">
					Use dependency injection to get a
					<code class="font-mono text-slate-700">Metrics.Factory</code>
					instance in your plugin's constructor. Then instantiate the Metrics class in your plugin's
					<code class="font-mono text-slate-700">onProxyInitialization(...)</code> method.
				</p>
				<CodeBlock
					code={processCode(instantiateVelocity)}
					lang="java"
					transformers={codeTransformers}
				/>
			</div>
		{:else if platform === 'server-implementation'}
			<div class="max-w-prose space-y-4">
				<p>
					If your server implementation is a fork of an existing server implementation on bStats,
					find the plugin ID and replace it with your own ID in the existing Metrics instantiation
					code.
				</p>
				<p>
					Please note that server implementations come with very little default charts due to their
					generic nature. Most notably, the player count chart is not included and must be added as
					a custom chart. It is very likely that the original server implementation already has code
					setup for custom charts. However, you still need to add the custom charts on the bStats
					site. It is highly recommended to set a filter for the player chart (min 0 and max to a
					reasonable value).
				</p>
				<p class="text-sm font-medium text-red-600">
					If you are creating a new server implementation instead of forking an existing one, this
					is your last warning to not hack together your own Metrics code without contacting us
					first.
				</p>
			</div>
		{:else}
			<p class="max-w-prose text-sm text-red-600">
				Error: No instructions for selected platform. This is a bug, please report it.
			</p>
		{/if}
		{#if !metricsInstantiated}
			<div class="mt-4">
				<Button
					size="large"
					onclick={() => {
						metricsInstantiated = true;
					}}
				>
					Continue
				</Button>
			</div>
		{/if}
	{/if}
</WizardStep>
