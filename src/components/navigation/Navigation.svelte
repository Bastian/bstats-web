<script lang="ts">
    import { session } from "$app/stores";
    import ChevronDownIcon from "$components/hero-icons/ChevronDownIcon.svelte";
    import MenuIcon from "$components/hero-icons/MenuIcon.svelte";
    import UserCircleIcon from "$components/hero-icons/UserCircleIcon.svelte";
    import dropdownToggle from "$helpers/dropdownToggle";
    import AccountDropdown from "./AccountDropdown.svelte";
    import GlobalStatsDropdown from "./GlobalStatsDropdown.svelte";
    import MobileDrawer from "./MobileDrawer.svelte";
    import MyPluginsDropdown from "./MyPluginsDropdown.svelte";

    let mobileNavOpen = false;
    let myPluginsDropdownOpen = false;
    let globalStatsDropdownOpen = false;
    let accountDropdownOpen = false;

    function handleMyPluginDropdownOpen(open: boolean) {
        myPluginsDropdownOpen = open;
        if (open) {
            globalStatsDropdownOpen = false;
            accountDropdownOpen = false;
        }
    }

    function handleGlobalStatsDropdownOpen(open: boolean) {
        globalStatsDropdownOpen = open;
        if (open) {
            myPluginsDropdownOpen = false;
            accountDropdownOpen = false;
        }
    }

    function handleAccountDropdownOpen(open: boolean) {
        accountDropdownOpen = open;
        if (open) {
            myPluginsDropdownOpen = false;
            globalStatsDropdownOpen = false;
        }
    }
</script>

<nav class="flex justify-between items-center w-full">
    <button class="sm:hidden" on:click={() => (mobileNavOpen = true)}>
        <MenuIcon class="w-8 h-8" />
    </button>
    <div class="flex-grow text-center md:flex-grow-0">
        <a
            class="text-2xl font-bold p-1 -ml-1 focus:outline-none focus:ring-1 ring-blue-200 rounded"
            href="/">bStats</a
        >
    </div>
    <div class="hidden flex-grow sm:block md:ml-16">
        {#if $session.user}
            <div
                class="inline-block mx-2"
                use:dropdownToggle={handleMyPluginDropdownOpen}
            >
                <button
                    class="inline-flex items-center p-2 text-base focus:outline-none focus:ring-1 ring-blue-200 rounded"
                    aria-haspopup="true"
                    aria-expanded={myPluginsDropdownOpen}
                >
                    <span>My Plugins</span>
                    <ChevronDownIcon class="ml-2 w-5 h-5" small />
                </button>

                <MyPluginsDropdown bind:open={myPluginsDropdownOpen} />
            </div>
        {/if}
        <div
            class="inline-block mx-2"
            use:dropdownToggle={handleGlobalStatsDropdownOpen}
        >
            <button
                class="inline-flex items-center p-2 text-base focus:outline-none focus:ring-1 ring-blue-200 rounded"
                aria-haspopup="true"
                aria-expanded={globalStatsDropdownOpen}
            >
                <span>Global Stats</span>
                <ChevronDownIcon class="ml-2 w-5 h-5" small />
            </button>

            <GlobalStatsDropdown bind:open={globalStatsDropdownOpen} />
        </div>
        <a
            class="mx-4 p-2 focus:outline-none focus:ring-1 ring-blue-200 rounded"
            href="/">Plugin List</a
        >
    </div>
    {#if $session.user}
        <div use:dropdownToggle={handleAccountDropdownOpen}>
            <button
                class="block focus:outline-none focus:ring-1 ring-blue-200 rounded-full"
                aria-haspopup="true"
                aria-expanded={accountDropdownOpen}
            >
                <UserCircleIcon class="w-10 h-10 rounded-full shadow-inner" />
            </button>
            <AccountDropdown bind:open={accountDropdownOpen} />
        </div>
    {:else}
        <div class="hidden sm:block">
            <a
                href="/login"
                class="mx-4 p-2 focus:outline-none focus:ring-1 ring-blue-200 rounded"
                >Login</a
            >
            <a
                href="/register"
                class="ml-2 p-2 focus:outline-none focus:ring-1 ring-blue-200 rounded"
                >Register</a
            >
        </div>
    {/if}
</nav>

<MobileDrawer bind:open={mobileNavOpen} />
