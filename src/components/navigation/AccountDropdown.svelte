<script lang="ts">
    import CogIcon from "$components/hero-icons/CogIcon.svelte";
    import LogoutIcon from "$components/hero-icons/LogoutIcon.svelte";
    import UserCircleIcon from "$components/hero-icons/UserCircleIcon.svelte";
    import Dropdown from "./Dropdown.svelte";
    import { session } from "$app/stores";

    export let open: boolean;
</script>

<Dropdown {open} direction="left">
    <article class="flex flex-col items-center w-64 p-4">
        <UserCircleIcon class="text-gray-500 rounded-full h-14 w-14" />
        <h4 class="max-w-full mt-1 text-lg font-medium text-gray-800 truncate">
            {$session?.user?.name ?? $session?.user?.email ?? "Unknown"}
        </h4>

        <div class="w-full mt-4 mb-2 border-b border-gray-200" />

        <a href="/" class="flex items-center w-full px-3 py-1">
            <CogIcon class="w-6 h-6 text-gray-700" slot="icon" />
            <span class="ml-2 text-gray-800">Manage Account</span>
        </a>

        <div class="w-full my-2 border-b border-gray-200" />

        <a href="/sessionLogout" class="flex items-center w-full px-3 py-1">
            <LogoutIcon class="w-6 h-6 text-gray-700" slot="icon" />
            <span class="ml-2 text-gray-800">Logout</span>
        </a>
    </article>
</Dropdown>
