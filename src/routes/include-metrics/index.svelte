<script lang="ts">
    import StandardNavigation from "$components/navigation/StandardNavigation.svelte";
    import type { Service } from "$defs/service.interface";
    import NameServiceStep from "./steps/_NameServiceStep.svelte";
    import SelectBuildToolStep from "./steps/_SelectBuildToolStep.svelte";
    import type { BuildTool } from "./steps/_SelectBuildToolStep.svelte";
    import SelectPlatformStep from "./steps/_SelectPlatformStep.svelte";
    import type { Platform } from "./steps/_SelectPlatformStep.svelte";
    import scrollIntoView from "$helpers/scrollIntoView";
    import MavenStep from "./steps/_MavenStep.svelte";
    import BukkitMetricsStep from "./steps/_BukkitMetricsStep.svelte";
    import GradleStep from "./steps/_GradleStep.svelte";
    import CopyAndPasteStep from "./steps/_CopyAndPasteStep.svelte";
    import BungeecordMetricsStep from "./steps/_BungeecordMetricsStep.svelte";
    import SpongeMetricsStep from "./steps/_SpongeMetricsStep.svelte";
    import VelocityMetricsStep from "./steps/_VelocityMetricsStep.svelte";
    import Step from "$components/Step.svelte";
    import { session } from "$app/stores";

    let selectedPlatform: Platform | undefined = undefined;
    let selectedBuildTool: BuildTool | undefined = undefined;

    let serviceId: number | null = undefined;

    function handleServiceAddSkip() {
        serviceId = null;
    }
    function handleServiceAdd(event: CustomEvent<Service>) {
        serviceId = event.detail.id;
    }
</script>

<svelte:head>
    <title>Include Metrics</title>
</svelte:head>

<StandardNavigation />

<div class="flex-grow pb-24 bg-gray-50 dark:bg-gray-900 background">
    <div class="container mx-auto mt-8 md:mt-16">
        <h1 class="block text-4xl font-bold text-blue-900 dark:text-gray-100">
            Include Metrics
        </h1>
        <span class="block mt-1 text-sm text-gray-400">
            This page guides you through the process of integrating bStats into
            your service.
        </span>
        <div class="mt-4 h-1 w-full bg-gray-200 dark:bg-gray-700 mb-8" />

        <SelectPlatformStep
            bind:selectedPlatform
            frozen={serviceId != undefined}
            step={1}
        />
        {#if selectedPlatform != undefined && $session.user}
            <div use:scrollIntoView={{ offset: -50 }}>
                <NameServiceStep
                    on:skip={handleServiceAddSkip}
                    on:addedService={handleServiceAdd}
                    step={2}
                />
            </div>
        {:else if $session.user}
            <Step step={2} inactive title="Name your service" />
        {/if}
        {#if selectedPlatform !== undefined && (serviceId !== undefined || !$session.user)}
            <div use:scrollIntoView={{ offset: -50 }}>
                <SelectBuildToolStep
                    bind:selectedBuildTool
                    step={3 - ($session.user ? 0 : 1)}
                />
            </div>
        {:else}
            <Step
                step={3 - ($session.user ? 0 : 1)}
                inactive
                title="Select your build tool"
            />
        {/if}
        {#if selectedBuildTool}
            <div use:scrollIntoView={{ offset: -50 }}>
                {#if selectedBuildTool == "maven"}
                    <MavenStep
                        step={4 - ($session.user ? 0 : 1)}
                        {selectedPlatform}
                    />
                {:else if selectedBuildTool == "gradle"}
                    <GradleStep
                        step={4 - ($session.user ? 0 : 1)}
                        {selectedPlatform}
                    />
                {:else if selectedBuildTool == "copy-paste"}
                    <CopyAndPasteStep
                        step={4 - ($session.user ? 0 : 1)}
                        {selectedPlatform}
                    />
                {/if}
                {#if selectedPlatform == "bukkit"}
                    <BukkitMetricsStep
                        step={5 - ($session.user ? 0 : 1)}
                        {serviceId}
                        {selectedBuildTool}
                    />
                {:else if selectedPlatform == "bungeecord"}
                    <BungeecordMetricsStep
                        step={5 - ($session.user ? 0 : 1)}
                        {serviceId}
                        {selectedBuildTool}
                    />
                {:else if selectedPlatform == "sponge"}
                    <SpongeMetricsStep
                        step={5 - ($session.user ? 0 : 1)}
                        {serviceId}
                        {selectedBuildTool}
                    />
                {:else if selectedPlatform == "velocity"}
                    <VelocityMetricsStep
                        step={5 - ($session.user ? 0 : 1)}
                        {serviceId}
                        {selectedBuildTool}
                    />
                {/if}
                <Step step={6 - ($session.user ? 0 : 1)} noLine title="Done!" />
            </div>
        {:else}
            <Step
                step={4 - ($session.user ? 0 : 1)}
                inactive
                title="Include bStats dependency"
            />
            <Step
                step={5 - ($session.user ? 0 : 1)}
                inactive
                title="Initialize the Metrics class"
            />
            <Step
                step={6 - ($session.user ? 0 : 1)}
                inactive
                noLine
                title="Done!"
            />
        {/if}
    </div>
</div>
