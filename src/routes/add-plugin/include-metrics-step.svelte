<script lang="ts" module>
    import type { Platform } from './platform-select-step.svelte';
    import type { BuildTool } from './build-tool-select-step.svelte';
    import type { StepStatus } from './wizard-step.svelte';
    import mavenDependency from './_maven-dependency.xml?raw';
    import mavenShade from './_maven-shade.xml?raw';
    import mavenFull from './_maven-full.xml?raw';
    import gradleRepositories from './_gradle-repositories.kts?raw';
    import gradleDependencies from './_gradle-dependencies.kts?raw';
    import gradlePlugins from './_gradle-plugins.kts?raw';
    import gradleShadowTask from './_gradle-shadow-task.kts?raw';

    // TODO Load from environment variable (or maybe directly from Maven Central?)
    export const METRICS_VERSION = '3.2.1';

    export type IncludeMetricsStepProps = {
        platform: Platform | null;
        buildTool: BuildTool | null;
        status: StepStatus;
        metricsIncluded?: boolean;
    };
</script>

<script lang="ts">
    import WizardStep from './wizard-step.svelte';
    import Button from '$lib/components/button.svelte';
    import CodeBlock from '$lib/components/code-block.svelte';
    import { Collapsible } from 'bits-ui';

    let {
        platform,
        buildTool,
        status,
        metricsIncluded = $bindable()
    }: IncludeMetricsStepProps = $props();

    function processCode(code: string): string {
        return code
            .replace('{{platform}}', platform ?? 'unknown')
            .replace('{{version}}', METRICS_VERSION);
    }
</script>

{#snippet NextButton()}
    {#if !metricsIncluded}
        <div class="mt-4">
            <Button
                size="large"
                onclick={() => {
                    metricsIncluded = true;
                }}
            >
                Continue
            </Button>
        </div>
    {/if}
{/snippet}

<WizardStep index={4} title="Include the Metrics dependency" {status}>
    {#if (status === 'active' || status === 'done') && platform && buildTool && platform !== 'server-implementation'}
        {#if buildTool === 'copy-and-paste'}
            <p class="max-w-prose">
                Copy the <a
                    href="https://github.com/Bastian/bStats-Metrics/blob/single-file/{platform}/Metrics.java"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="font-bold text-brand-600 underline hover:text-brand-800"
                >
                    Metrics.java
                </a>
                file into your project source code and update the
                <code>package</code> to your own package.
            </p>
            <div class="doc-callout doc-callout-warning mt-4">
                <p class="mt-2 max-w-prose text-sm text-slate-600 dark:text-slate-400">
                    You <b>MUST NOT</b> modify the code in any way except for the package name. Doing
                    so will result in your plugin being removed from bStats and your account being banned.
                </p>
                <p class="mt-2 max-w-prose text-sm text-slate-600 dark:text-slate-400">
                    Especially, do <b>NOT</b> remove the option for users to opt-out of metrics collection.
                </p>
            </div>
        {:else if buildTool === 'maven'}
            <div class="space-y-4">
                <p>Add the bStats dependency:</p>
                <CodeBlock code={processCode(mavenDependency)} lang="xml" />
                <div class="max-w-prose">
                    Relocate <code class="font-mono text-slate-700 dark:text-slate-300"
                        >org.bstats</code
                    >
                    into your own package for example with the
                    <code class="font-mono text-slate-700 dark:text-slate-300"
                        >maven-shade-plugin</code
                    >:
                </div>
                <CodeBlock code={processCode(mavenShade)} lang="xml" />
                <Collapsible.Root class="w-full">
                    <div class="max-w-prose">
                        That's it. Your final <code
                            class="font-mono text-slate-700 dark:text-slate-300">pom.xml</code
                        >
                        should look similar to this: <Collapsible.Trigger
                            class="cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                        >
                            <span class="font-medium text-brand-600">Show code</span>
                        </Collapsible.Trigger>.
                    </div>

                    <Collapsible.Content
                        hiddenUntilFound
                        class="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden"
                    >
                        <CodeBlock code={processCode(mavenFull)} lang="xml" />
                    </Collapsible.Content>
                </Collapsible.Root>
            </div>
        {:else if buildTool === 'gradle'}
            <div class="space-y-4">
                <p>Ensure that Maven Central is available:</p>
                <CodeBlock code={processCode(gradleRepositories)} lang="kotlin" />
                <p>Add the bStats dependency:</p>
                <CodeBlock code={processCode(gradleDependencies)} lang="kotlin" />
                <p>
                    Relocate <code class="font-mono text-slate-700 dark:text-slate-300"
                        >org.bstats</code
                    >
                    into your own package for example with the
                    <code class="font-mono text-slate-700 dark:text-slate-300">Shadow</code> plugin:
                </p>
                <CodeBlock code={processCode(gradlePlugins)} lang="kotlin" />
                <CodeBlock code={processCode(gradleShadowTask)} lang="kotlin" />
                <p class="text-sm text-slate-600 dark:text-slate-400">
                    Run <code class="font-mono text-slate-700 dark:text-slate-300"
                        >./gradlew shadowJar</code
                    > to build a jar with Metrics included.
                </p>
            </div>
        {:else if buildTool === 'composer'}
            <div class="space-y-4">
                <p class="max-w-prose">
                    Add the bStats PocketMine-MP package via Composer:
                </p>
                <CodeBlock code="composer require bstats/pocketmine-mp" lang="bash" />
                <p class="max-w-prose text-sm text-slate-600 dark:text-slate-400">
                    Make sure to use a build tool or compiler that supports
                    <a
                        href="https://poggit.github.io/support/virion.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="font-medium text-brand-600 underline hover:text-brand-800"
                    >Virion</a>, like
                    <a
                        href="https://poggit.github.io/support/faq"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="font-medium text-brand-600 underline hover:text-brand-800"
                    >Poggit CI</a> or
                    <a
                        href="https://github.com/SOF3/pharynx"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="font-medium text-brand-600 underline hover:text-brand-800"
                    >pharynx</a>.
                </p>
            </div>
        {:else}
            <p class="text-sm text-red-600">
                Error: No instructions for selected build tool. This is a bug, please report it.
            </p>
        {/if}
        {@render NextButton()}
    {/if}
    {#if (status === 'active' || status === 'done') && platform && buildTool && platform === 'server-implementation'}
        <div class="max-w-prose space-y-4">
            <p>
                If your server implementation is a fork of a server implementation that already has
                bStats integrated, you don't have to do anything and can continue to the next step.
            </p>
            <p>
                Otherwise, please contact us in our Discord server or via a GitHub issue to consult
                us how to best include bStats Metrics in your server implementation.
                <span class="font-bold">
                    Do <span class="text-red-600">NOT</span> try to include bStats on your own without
                    consulting us first, or your server implementation will get removed and your account
                    banned
                </span>.
            </p>
            {@render NextButton()}
        </div>
    {/if}
</WizardStep>
