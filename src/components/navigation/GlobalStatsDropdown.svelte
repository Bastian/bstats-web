<script lang="ts">
    import Dropdown from "./Dropdown.svelte";
    import { session } from '$app/stores';

    export let open: boolean;

    let links: {text: string, href: string}[];
    $: links = $session.softwareList
        .filter(software => !!software.globalPlugin)
        .map(software => ({
            text: software.name,
            href: `/global/${software.url}`
        }));
</script>

<Dropdown {open} {links} />
