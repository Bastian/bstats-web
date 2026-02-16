<script lang="ts">
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
    import Badge from '$lib/components/badge.svelte';
    import PageHero from '$lib/components/page-hero.svelte';
    import { MetaTags } from 'svelte-meta-tags';
    import { getCanonicalUrl } from '$lib/utils/url';
    import type { PageProps } from './$types';
    import BuildToolSelectStep, { type BuildTool } from './build-tool-select-step.svelte';
    import IncludeMetricsStep from './include-metrics-step.svelte';
    import InstantiateMetricsStep from './instantiate-metrics-step.svelte';
    import PlatformSelectStep, { type Platform } from './platform-select-step.svelte';
    import RegisterPluginStep from './register-plugin-step.svelte';
    import WizardStep from './wizard-step.svelte';
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

    $effect(() => {
        if (selectedPlatform === 'pocketmine') {
            selectedBuildTool = 'composer';
        } else if (selectedBuildTool === 'composer') {
            selectedBuildTool = null;
            metricsIncluded = false;
            metricsInstantiated = false;
        }
    });
</script>

<MetaTags
    title="Add plugin - bStats"
    description="A guided walkthrough for integrating bStats into your plugin. Choose your platform, register, include the dependency, and instantiate the Metrics class."
    openGraph={{
        title: 'Add plugin',
        description:
            'A guided walkthrough for integrating bStats into your plugin. Choose your platform, register, include the dependency, and instantiate the Metrics class.',
        type: 'website',
        url: getCanonicalUrl(page.url),
        siteName: 'bStats',
        locale: 'en_US'
    }}
/>

<main class="pb-24">
    <PageHero>
        {#snippet badge()}<Badge>Documentation</Badge>{/snippet}
        {#snippet title()}Add plugin{/snippet}
        {#snippet content()}
            A guided flow for including bStats into your plugin. Pick the platform, register the
            plugin, add the bStats dependency and instantiate the Metrics class in your code.
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
                status={plugin || pluginCreationSkipped
                    ? 'done'
                    : selectedPlatform
                      ? 'active'
                      : 'locked'}
            />

            <BuildToolSelectStep
                bind:selectedBuildTool
                platform={selectedPlatform}
                status={selectedBuildTool && (plugin || pluginCreationSkipped)
                    ? 'done'
                    : plugin || pluginCreationSkipped
                      ? 'active'
                      : 'locked'}
            />

            <IncludeMetricsStep
                platform={selectedPlatform}
                buildTool={selectedBuildTool}
                bind:metricsIncluded
                status={metricsIncluded
                    ? 'done'
                    : selectedBuildTool && (plugin || pluginCreationSkipped)
                      ? 'active'
                      : 'locked'}
            />

            <InstantiateMetricsStep
                platform={selectedPlatform}
                {plugin}
                buildTool={selectedBuildTool}
                bind:metricsInstantiated
                status={metricsInstantiated ? 'done' : metricsIncluded ? 'active' : 'locked'}
            />

            <WizardStep index={6} title="Done" status={metricsInstantiated ? 'done' : 'locked'}>
                <p class="max-w-prose">
                    You have successfully included bStats Metrics in your plugin.
                </p>

                <div class="doc-callout doc-callout-info mt-4">
                    <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        When will data show up?
                    </p>
                    <p class="mt-2 max-w-prose text-sm text-slate-600 dark:text-slate-400">
                        After the server starts, the first data is sent after a random 3-6 minute
                        delay. The site publishes updates at hh:00 and hh:30, so once data is sent
                        it may take up to 30 minutes to become visible.
                    </p>
                </div>

                <div
                    class="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-dark-700 dark:bg-dark-800"
                >
                    <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        What's next?
                    </h3>
                    <p class="mt-2 max-w-prose text-sm text-slate-600 dark:text-slate-400">
                        Beyond the default metrics, you can track custom data specific to your
                        plugin with custom charts. Add pie charts for configuration options, line
                        charts for trends, or bar charts for feature adoption.
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
                            href={resolve(
                                `/plugin/${plugin.platform}/${plugin.pluginName}/${plugin.pluginId}`
                            )}
                            class="inline-flex gap-2 text-sm font-semibold text-brand-600 underline hover:text-brand-800"
                        >
                            View your plugin on bStats <IconArrowRight size={18} />
                        </a>
                    </div>
                {/if}
            </WizardStep>
        </div>
    </section>
</main>
