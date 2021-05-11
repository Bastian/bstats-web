<script context="module" lang="ts">
    import { findAllSoftware } from "$api/findAllSoftware";
    import { browser } from "$app/env";
    import { session } from "$app/stores";
    import Footer from "$components/Footer.svelte";
    import type { Load } from "@sveltejs/kit";
    import "../global.css";

    export const load: Load = async ({ fetch, session }) => {
        const { API_BASE_URL } = session;
        session.softwareList = await findAllSoftware(API_BASE_URL, fetch);
        return { };
    };
</script>

<script lang="ts">
    if ($session.user && !$session.user.email_verified && browser) {
        // TODO Do not use alert
        alert("Your email is not yet verified. Please verify your email!");
    }
</script>

<main class="flex h-full flex-col">
    <slot></slot>
    <Footer/>
</main>
