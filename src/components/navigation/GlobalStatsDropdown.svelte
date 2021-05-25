<script lang="ts">
    import { session } from "$app/stores";
    import type { Software } from "$defs/software/software.interface";
    import Dropdown from "./Dropdown.svelte";
    import DropdownLinks from "./DropdownLinks.svelte";

    export let open: boolean;

    let links: { text: string; href: string }[];
    $: links = ($session.softwareList as Software[])
        .filter((software) => !!software.globalPlugin)
        .map((software) => ({
            text: software.name,
            href: `/global/${software.url}`,
        }));
</script>

<Dropdown {open}>
    <DropdownLinks {links} />
</Dropdown>
