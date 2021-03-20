<script context="module" lang="ts">
    import type {Preload} from "@sapper/common";
    import {findAllSoftware} from "../api/findAllSoftware";

    export const preload: Preload = async function(this, page, session) {
        const { API_BASE_URL } = session;
        session.softwareList = await findAllSoftware(API_BASE_URL, this.fetch);
        return { };
    }
</script>

<script lang="ts">
    import Footer from "../components/Footer.svelte";
</script>

<main class="flex h-full flex-col">
    <slot></slot>
    <Footer/>
</main>
