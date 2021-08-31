<script lang="ts">
    import { session } from "$app/stores";
    import ChevronDownIcon from "$components/hero-icons/ChevronDownIcon.svelte";
    import MenuIcon from "$components/hero-icons/MenuIcon.svelte";
    import UserCircleIcon from "$components/hero-icons/UserCircleIcon.svelte";
    import dropdownToggle from "$helpers/dropdownToggle";
    import AccountDropdown from "./AccountDropdown.svelte";
    import GlobalStatsDropdown from "./GlobalStatsDropdown.svelte";
    import MobileDrawer from "./MobileDrawer.svelte";
    import MyServicesDropdown from "./MyServicesDropdown.svelte";

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

<nav class="flex items-center justify-between w-full">
    <button class="z-10 sm:hidden" on:click={() => (mobileNavOpen = true)}>
        <MenuIcon class="w-8 h-8" />
    </button>
    <div
        class="absolute left-0 right-0 flex-grow text-center sm:static md:flex-grow-0"
    >
        <a
            class="p-1 -ml-1 text-2xl font-bold rounded focus:outline-none focus:ring-1 ring-blue-200"
            href="/"
        >
            bStats
        </a>
    </div>
    <div class="z-10 flex-grow hidden sm:block md:ml-16">
        {#if $session.user}
            <div
                class="inline-block mx-2"
                use:dropdownToggle={handleMyPluginDropdownOpen}
            >
                <button
                    class="inline-flex items-center p-2 text-base rounded focus:outline-none focus:ring-1 ring-blue-200"
                    aria-haspopup="true"
                    aria-expanded={myPluginsDropdownOpen}
                >
                    <span>My Services</span>
                    <ChevronDownIcon class="w-5 h-5 ml-2" small />
                </button>

                <MyServicesDropdown bind:open={myPluginsDropdownOpen} />
            </div>
        {/if}
        <div
            class="inline-block mx-2"
            use:dropdownToggle={handleGlobalStatsDropdownOpen}
        >
            <button
                class="inline-flex items-center p-2 text-base rounded focus:outline-none focus:ring-1 ring-blue-200"
                aria-haspopup="true"
                aria-expanded={globalStatsDropdownOpen}
            >
                <span>Global Stats</span>
                <ChevronDownIcon class="w-5 h-5 ml-2" small />
            </button>

            <GlobalStatsDropdown bind:open={globalStatsDropdownOpen} />
        </div>
        <a
            class="p-2 mx-4 rounded focus:outline-none focus:ring-1 ring-blue-200"
            href="/service-list"
        >
            Service List
        </a>
    </div>
    {#if $session.user}
        <div class="z-10" use:dropdownToggle={handleAccountDropdownOpen}>
            <button
                class="block rounded-full focus:outline-none focus:ring-1 ring-blue-200"
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
                class="p-2 mx-4 rounded focus:outline-none focus:ring-1 ring-blue-200"
            >
                Login
            </a>
            <a
                href="/register"
                class="p-2 ml-2 rounded focus:outline-none focus:ring-1 ring-blue-200"
            >
                Register
            </a>
        </div>
    {/if}
</nav>

<MobileDrawer bind:open={mobileNavOpen} />
