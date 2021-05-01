<script lang="ts">
    import clickOutside from "../../helpers/clickOutside";
    import MobileDrawer from "./MobileDrawer.svelte";
    import MenuIcon from "../hero-icons/MenuIcon.svelte";
    import ChevronDownIcon from "../hero-icons/ChevronDownIcon.svelte";
    import GlobalStatsDropdown from "./GlobalStatsDropdown.svelte";
    import MyPluginsDropdown from "./MyPluginsDropdown.svelte";
    import {session} from "$app/stores";
    import AccountDropdown from "./AccountDropdown.svelte";

    let mobileNavOpen = false;
    let myPluginsDropdownOpen = false;
    let globalStatsDropdownOpen = false;
    let accountDropdownOpen = false;
</script>

<nav class="flex justify-between items-center w-full">
    <button class="sm:hidden" on:click={() => mobileNavOpen = true}>
        <MenuIcon class="w-8 h-8"/>
    </button>
    <div class="flex-grow text-center md:flex-grow-0">
        <a class="text-2xl font-bold" href="/">bStats</a>
    </div>
    <div class="hidden flex-grow p-2 sm:block md:ml-16">
        {#if $session.user}
            <div class="inline-block" use:clickOutside={() => myPluginsDropdownOpen = false}>
                <button on:click={() => myPluginsDropdownOpen = !myPluginsDropdownOpen} class="inline-flex items-center mx-4 mr-2 text-base focus:outline-none">
                    <span>My Plugins</span>
                    <ChevronDownIcon class="ml-2 w-5 h-5" small/>
                </button>

                <MyPluginsDropdown bind:open={myPluginsDropdownOpen}/>
            </div>
        {/if}
        <div class="inline-block" use:clickOutside={() => globalStatsDropdownOpen = false}>
            <button on:click={() => globalStatsDropdownOpen = !globalStatsDropdownOpen}  class="inline-flex items-center mx-4 mr-2 text-base focus:outline-none">
                <span>Global Stats</span>
                <ChevronDownIcon class="ml-2 w-5 h-5" small/>
            </button>

            <GlobalStatsDropdown bind:open={globalStatsDropdownOpen}/>
        </div>
        <a class="mx-4" href="/">Plugin List</a>
    </div>
    {#if $session.user}
        <button
            on:click={() => accountDropdownOpen = !accountDropdownOpen}
            use:clickOutside={() => accountDropdownOpen = false}
            class="focus:outline-none"
        >
            <img alt="User Avatar" src={$session.user?.picture} class="w-9 h-9 rounded-full shadow-inner">
            <AccountDropdown bind:open={accountDropdownOpen}/>
        </button>
    {:else}
        <div class="hidden sm:block">
            <a href="/login" class="mx-4">Login</a>
            <a href="/register" class="ml-2">Register</a>
        </div>
    {/if}

</nav>

<MobileDrawer bind:open={mobileNavOpen}/>
