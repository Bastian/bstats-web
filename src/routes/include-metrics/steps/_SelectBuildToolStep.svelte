<script lang="ts" context="module">
    export type BuildTool = "gradle" | "maven" | "copy-paste";
</script>

<script lang="ts">
    import ClipboardCopyIcon from "$components/hero-icons/ClipboardCopyIcon.svelte";
    import Step from "$components/Step.svelte";
    import SelectCardButton from "../_SelectCardButton.svelte";

    export let step: number;
    export let selectedBuildTool: BuildTool | undefined = undefined;
</script>

<Step {step} title="Select your build tool">
    <span slot="description">
        How do you want to include bStats into your plugin? If you are already
        using a build tool, select it below. If you have no experience with
        Gradle or Maven, select "Copy & Paste".
    </span>
    <div class="flex flex-wrap mt-2 -ml-2">
        <SelectCardButton
            text="Gradle"
            logoSrc="/logos/gradle-elephant-icon-dark-green.svg"
            logoSrcDark="/logos/gradle-elephant-icon-gradient-primary.svg"
            on:click={() => (selectedBuildTool = "gradle")}
            selected={selectedBuildTool == "gradle"}
        />
        <SelectCardButton
            text="Maven"
            logoSrc="/logos/maven-feather.png"
            on:click={() => (selectedBuildTool = "maven")}
            selected={selectedBuildTool == "maven"}
        />
        <SelectCardButton
            text="Copy & Paste"
            on:click={() => (selectedBuildTool = "copy-paste")}
            selected={selectedBuildTool == "copy-paste"}
        >
            <ClipboardCopyIcon
                slot="logo"
                class="mt-3 text-gray-700 h-11 w-11 dark:text-gray-200"
            />
        </SelectCardButton>
    </div>
</Step>
