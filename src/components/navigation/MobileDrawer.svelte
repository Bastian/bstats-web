<script lang="ts">
    import {fade, fly} from "svelte/transition";
    import Label from "../Label.svelte";
    import MapIcon from "../hero-icons/MapIcon.svelte";
    import GlobeIcon from "../hero-icons/GlobeIcon.svelte";
    import CollectionIcon from "../hero-icons/CollectionIcon.svelte";
    import MobileDrawerSection from "./MobileDrawerSection.svelte";

    import {session} from "$app/stores";
    import type {Software} from "../../definitions/software/software.interface";
    import KeyIcon from "../hero-icons/KeyIcon.svelte";

    export let open = false;

    const handleClose = () => {
        open = false;
    };

    $: {
        // Prevent scrolling of the background when drawer is open
        if (typeof window !== "undefined") {
            if (open) {
                document.documentElement.classList.add("overflow-hidden");
            } else {
                document.documentElement.classList.remove("overflow-hidden");
            }
        }
    }

    let globalStatsLinks: { text: string, href: string }[];
    $: globalStatsLinks = ($session.softwareList as Software[])
        .filter(software => !!software.globalPlugin)
        .map(software => ({
            text: software.name,
            href: `/global/${software.url}`
        }));
</script>

<style>
    .drawer {
        max-width: 22rem;
        width: 80vw;
    }
</style>

{#if open}
    <div
        transition:fly={{ x: -200, duration: 200 }}
        class="overflow-y-auto fixed top-0 bottom-0 left-0 z-50 text-black bg-white drawer dark:bg-gray-900 dark:text-white"
    >
        <div class="my-12 text-4xl font-bold text-center text-white text-blue-800 dark:text-blue-400">
            bStats
        </div>
        <div class="py-2 mx-8 border-t-2 border-gray-200"></div>

        <div class="m-8 mt-4 space-y-12">
            {#if !$session.user}
                <MobileDrawerSection
                    title="Account"
                    links={[
                        { text: "Login", href: "/login" },
                        { text: "Register", href: "/register" }
                    ]}
                    bind:drawerOpen={open}
                >
                    <KeyIcon slot="icon"/>
                </MobileDrawerSection>
            {/if}

            <MobileDrawerSection
                title="Navigation"
                links={[{ text: "Plugin List", href: "/" }]}
                bind:drawerOpen={open}
            >
                <MapIcon slot="icon"/>
            </MobileDrawerSection>


            <MobileDrawerSection title="Global Stats" links={globalStatsLinks} bind:drawerOpen={open}>
                <GlobeIcon slot="icon"/>
            </MobileDrawerSection>

            <MobileDrawerSection
                title="My Plugins"
                links={[
                    { text: "SafeTrade", href: "/", software: "Bukkit / Spigot" },
                    { text: "Super Duper Spleef", href: "/", software: "Bungeecord" },
                ]}
                bind:drawerOpen={open}
            >
                <CollectionIcon slot="icon"/>
                <Label slot="link-appendix" class="ml-2" let:link>
                    {link.software}
                </Label>
            </MobileDrawerSection>
        </div>
    </div>

    <!-- Overlay for the background -->
    <div
        on:click={handleClose}
        transition:fade={{ duration: 200 }}
        class="fixed top-0 right-0 bottom-0 left-0 z-40 bg-black bg-opacity-60"
    ></div>
{/if}
