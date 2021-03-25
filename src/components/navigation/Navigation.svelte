<script lang="ts">
    import clickOutside from "../../helpers/clickOutside";
    import MobileDrawer from "./MobileDrawer.svelte";
    import MenuIcon from "../hero-icons/MenuIcon.svelte";
    import ChevronDownIcon from "../hero-icons/ChevronDownIcon.svelte";
    import UserCircleIcon from "../hero-icons/UserCircleIcon.svelte";
    import GlobalStatsDropdown from "./GlobalStatsDropdown.svelte";
    import MyPluginsDropdown from "./MyPluginsDropdown.svelte";

    let mobileNavOpen = false;
    let myPluginsDropdownOpen = false;
    let globalStatsDropdownOpen = false;
</script>

<nav class="flex items-center w-full">
    <button on:click={() => mobileNavOpen = true}>
        <MenuIcon class="w-8 h-8 sm:hidden"/>
    </button>
    <div class="flex-grow text-center md:flex-grow-0">
        <a class="text-2xl font-bold" href="/">bStats</a>
    </div>
    <div class="hidden flex-grow p-2 sm:block md:pl-32">
        <div class="inline-block" use:clickOutside={() => myPluginsDropdownOpen = false}>
            <button class="inline-flex items-center mx-4 mr-2 text-base focus:outline-none" on:click={() => myPluginsDropdownOpen = !myPluginsDropdownOpen}>
                <span>My Plugins</span>
                <ChevronDownIcon class="ml-2 w-5 h-5" small/>
            </button>

            <MyPluginsDropdown bind:open={myPluginsDropdownOpen}/>
        </div>
        <div class="inline-block" use:clickOutside={() => globalStatsDropdownOpen = false}>
            <button class="inline-flex items-center mx-4 mr-2 text-base focus:outline-none" on:click={() => globalStatsDropdownOpen = !globalStatsDropdownOpen}>
                <span>Global Stats</span>
                <ChevronDownIcon class="ml-2 w-5 h-5" small/>
            </button>

            <GlobalStatsDropdown bind:open={globalStatsDropdownOpen}/>
        </div>
        <a class="mx-4" href="/">Plugin List</a>
    </div>
    <a href="/">
        <UserCircleIcon class="h-10 w-10"/>
    </a>
</nav>

<MobileDrawer bind:open={mobileNavOpen}/>
