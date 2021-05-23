<script lang="ts" context="module">
    export type Platform = "bukkit" | "bungeecord" | "sponge" | "velocity";
</script>

<script lang="ts">
    import Step from "$components/Step.svelte";
    import SelectCardButton from "../_SelectCardButton.svelte";

    export let step: number;
    export let selectedPlatform: Platform | undefined = undefined;

    export let frozen = false;
</script>

<Step {step} title="Select the platform of your service">
    <span slot="description">
        Please select the platform that your service will run on. If your
        service supports multiple platforms, please choose one. After finishing
        the complete process, start again and select the next platform.
    </span>
    <div class="flex flex-wrap -ml-2">
        <SelectCardButton
            text="Bukkit / Spigot"
            logoSrc="/logos/spigot.png"
            disabled={frozen}
            on:click={() => (selectedPlatform = "bukkit")}
            selected={selectedPlatform == "bukkit"}
        />
        <SelectCardButton
            text="Bungeecord"
            logoSrc="/logos/bungeecord.png"
            disabled={frozen}
            on:click={() => (selectedPlatform = "bungeecord")}
            selected={selectedPlatform == "bungeecord"}
        />
        <SelectCardButton
            text="Sponge"
            logoSrc="/logos/spongie-mark.svg"
            disabled={frozen}
            on:click={() => (selectedPlatform = "sponge")}
            selected={selectedPlatform == "sponge"}
        />
        <SelectCardButton
            text="Velocity"
            logoSrc="/logos/velocity.png"
            disabled={frozen}
            on:click={() => (selectedPlatform = "velocity")}
            selected={selectedPlatform == "velocity"}
        />
    </div>
</Step>
