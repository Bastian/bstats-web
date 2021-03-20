<script lang="ts">
    import Dropdown from "./Dropdown.svelte";
    import {stores} from '@sapper/app';

    export let open: boolean;

    const { session } = stores();

    let links: {text: string, href: string}[];
    $: links = $session.softwareList
        .filter(software => !!software.globalPlugin)
        .map(software => ({
            text: software.name,
            href: `/services/${software.globalPlugin}`
        }));
</script>

<Dropdown {open} {links} />
