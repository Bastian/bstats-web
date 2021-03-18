<script lang="ts">
    import clickOutside from "svelte-outside-click";
    import MyPluginsDropdown from "./MyPluginsDropdown.svelte";
    import MobileDrawer from "./MobileDrawer.svelte";
    import MenuIcon from "../hero-icons/MenuIcon.svelte";
    import ChevronDownIcon from "../hero-icons/ChevronDownIcon.svelte";
    import UserCircleIcon from "../hero-icons/UserCircleIcon.svelte";

    let mobileNavOpen = false;
    let dropdownOpen = false;

    const handleDropdownClickOutside = () => {
        dropdownOpen = false;
    };

    const handleDropdownOpenChange = () => {
        dropdownOpen = !dropdownOpen;
    };

    const handleMobileNavOpen = () => {
        mobileNavOpen = true;
    };
</script>

<nav class="flex items-center w-full">
    <button on:click={handleMobileNavOpen}>
        <MenuIcon class="w-8 h-8 sm:hidden"/>
    </button>
    <div class="flex-grow py-2 text-center md:flex-grow-0">
        <a class="text-2xl font-bold" href="/">bStats</a>
    </div>
    <div class="hidden flex-grow p-4 sm:block md:pl-32">
        <div class="inline-block" use:clickOutside={handleDropdownClickOutside}>
            <button class="inline-flex items-center mx-4 mr-2 text-base focus:outline-none" on:click={handleDropdownOpenChange}>
                <span>My Plugins</span>
                <ChevronDownIcon class="ml-2 w-5 h-5" small/>
            </button>

            <MyPluginsDropdown bind:open={dropdownOpen}/>
        </div>
        <a class="mx-4" href="/">Global Stats</a>
        <a class="mx-4" href="/">Plugin List</a>
    </div>
    <a href="/">
        <UserCircleIcon class="h-12 w-12"/>
    </a>
</nav>

<MobileDrawer bind:open={mobileNavOpen}/>
