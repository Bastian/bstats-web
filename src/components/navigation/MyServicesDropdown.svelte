<script lang="ts">
    import PlusIcon from "$components/hero-icons/PlusIcon.svelte";
    import Label from "$components/Label.svelte";
    import Dropdown from "./Dropdown.svelte";
    import DropdownLinks from "./DropdownLinks.svelte";

    export let open: boolean;

    const links = [
        { text: "SafeTrade", href: "/", software: "Bukkit / Spigot" },
        { text: "Super Duper Spleef", href: "/", software: "Bungeecord" },
    ];
</script>

<Dropdown {open}>
    <DropdownLinks
        {links}
        actionLabel={{ text: "Add Service", href: "/include-metrics" }}
    >
        <PlusIcon slot="action-icon" />
        <Label slot="link-appendix" class="ml-1" let:link>
            {link.software}
        </Label>
    </DropdownLinks>
</Dropdown>
