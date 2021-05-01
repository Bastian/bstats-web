<script lang="ts">
    import Dropdown from "./Dropdown.svelte";
    import { session } from "$app/stores";
    import type {Software} from "../../definitions/software/software.interface";

    export let open: boolean;

    let links: {text: string, href: string}[];
    $: links = ($session.softwareList as Software[])
        .filter(software => !!software.globalPlugin)
        .map(software => ({
            text: software.name,
            href: `/global/${software.url}`
        }));
</script>

<Dropdown {open} {links} />
