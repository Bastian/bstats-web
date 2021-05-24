<script lang="ts">
    import ExternalLinkIcon from "$components/hero-icons/ExternalLinkIcon.svelte";
    import Step from "$components/Step.svelte";
    import type { Platform } from "./_SelectPlatformStep.svelte";

    export let selectedPlatform: Platform;
    export let step: number;

    let url: string;
    $: url = `https://github.com/Bastian/bStats-Metrics/blob/single-file/${selectedPlatform}/Metrics.java`;
</script>

<Step {step} title="Copy the Metrics class into your project">
    <span slot="description">
        Go to GitHub and copy the complete
        <span class="inline-flex items-center">
            <a
                class="border-b-2 border-gray-300 dark:border-gray-400"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
            >
                <code class="font-bold text-gray-700 dark:text-gray-200">
                    Metrics.java
                </code>
            </a>
            <ExternalLinkIcon class="w-5 h-5 ml-1" small />
        </span>
        file into your project. Then update the package to match the package to which
        your copied it. Do not modify anything else of the file.
    </span>
</Step>
