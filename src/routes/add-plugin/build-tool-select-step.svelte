<script lang="ts" module>
    import imgMaven from '$lib/assets/images/logos/maven-feather.png';
    import imgGradle from '$lib/assets/images/logos/gradle-elephant-icon-dark-green.svg';
    import IconCopy from '@tabler/icons-svelte/icons/copy';
    import imgComposer from '$lib/assets/images/logos/composer.png';
    import type { Platform } from './platform-select-step.svelte';

    export type BuildTool = 'copy-and-paste' | 'maven' | 'gradle' | 'composer';

    const buildToolOptions = [
        {
            id: 'copy-and-paste',
            label: 'Copy & paste',
            description: 'Copy the Metrics.java into your project manually.',
            icon: IconCopy
        },
        {
            id: 'maven',
            label: 'Maven',
            description: 'Shade bStats into your jar with the Maven Shade plugin.',
            iconUrl: imgMaven
        },
        {
            id: 'gradle',
            label: 'Gradle',
            description: 'Bundle bStats via the Gradle Shadow plugin.',
            iconUrl: imgGradle
        },
        {
            id: 'composer',
            label: 'Composer',
            description: 'Add bStats as a Composer dependency.',
            iconUrl: imgComposer
        }
    ] as const;
</script>

<script lang="ts">
    import OptionCard from './option-card.svelte';
    import WizardStep, { type StepStatus } from './wizard-step.svelte';

    let {
        selectedBuildTool = $bindable(),
        platform,
        status
    }: {
        selectedBuildTool?: BuildTool | null;
        platform: Platform | null;
        status: StepStatus;
    } = $props();

    let filteredOptions = $derived(
        platform === 'pocketmine'
            ? buildToolOptions.filter((o) => o.id === 'composer')
            : buildToolOptions.filter((o) => o.id !== 'composer')
    );
</script>

<WizardStep index={3} title="Pick your build workflow" {status}>
    {#if filteredOptions.length === 1}
        <p class="max-w-prose">
            {filteredOptions[0].label} is the only supported build workflow for this platform.
        </p>
    {:else}
        <p class="max-w-prose">
            Choose how you want to include Metrics. Using a build tool is recommended, but you can
            also copy & paste the Metrics class manually.
        </p>
    {/if}
    <div class="mt-4 grid gap-4 md:grid-cols-3">
        {#each filteredOptions as option (option.id)}
            <OptionCard
                label={option.label}
                active={selectedBuildTool === option.id}
                description={option.description}
                onclick={() => (selectedBuildTool = option.id)}
            >
                {#snippet icon()}
                    {#if 'iconUrl' in option}
                        <img src={option.iconUrl} alt="" class="object-cover" />
                    {:else}
                        <option.icon />
                    {/if}
                {/snippet}
            </OptionCard>
        {/each}
    </div>
</WizardStep>
