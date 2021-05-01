<script lang="ts">
    import Dropdown from "./Dropdown.svelte";

    export let open: boolean;

    const links = [
        { text: "Edit Profile", href: "/" },
        { text: "Logout", href: "/sessionLogout" },
    ];
</script>

<Dropdown {open} {links} direction="left" />
