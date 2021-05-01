<script context="module" lang="ts">
    import {findAllSoftware} from "../api/findAllSoftware";
    import type {Load} from "@sveltejs/kit";
    import "../global.css";

    export const load: Load = async ({ fetch, session }) => {
        const { API_BASE_URL } = session;
        session.softwareList = await findAllSoftware(API_BASE_URL, fetch);
        return { };
    };
</script>

<script lang="ts">
    import Footer from "../components/Footer.svelte";
</script>

<main class="flex h-full flex-col">
    <slot></slot>
    <Footer/>
</main>
