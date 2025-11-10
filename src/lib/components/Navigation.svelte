<script lang="ts">
    import Button from '$lib/components/Button.svelte';
    import { NavigationMenu } from '$lib/components/navigation-menu';
    import { resolve } from '$app/paths';
    import IconChevronDown from '@tabler/icons-svelte/icons/chevron-down';
    import IconChevronRight from '@tabler/icons-svelte/icons/chevron-right';

    import type { User } from 'better-auth';
    import { authClient } from '$lib/auth.client';
    import type { Software } from '$lib/server/redis/software';

    type Plugin = {
        id: number;
        name: string;
        software: {
            id: number;
            name: string;
            url: string;
        };
    };

    let {
        allSoftware = [],
        myPlugins = [],
        user
    }: {
        user: User | null;
        allSoftware?: Software[];
        myPlugins?: Plugin[];
    } = $props();

    const globalSoftware = $derived(
        allSoftware.filter((software) => software && software.globalPlugin)
    );

    const plugins = $derived(myPlugins || []);
    const username = $derived(user?.name ?? '');
    const usernameInitial = $derived(username ? username.charAt(0).toUpperCase() : '🙂');
    const isAdmin = $derived(() => {
        if (!user?.role) return false;
        return user.role
            .split(',')
            .map((value) => value.trim().toLowerCase())
            .includes('admin');
    });

    let mobileNavOpen = $state(false);

    function toggleMobileNav() {
        mobileNavOpen = !mobileNavOpen;
    }

    function closeMobileNav() {
        mobileNavOpen = false;
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape' && mobileNavOpen) {
            closeMobileNav();
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

<header class="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
    <div class="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href={resolve('/')} class="group flex items-center gap-3">
            <span
                aria-hidden="true"
                class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 font-display text-lg font-semibold text-white shadow-floating transition-transform group-hover:-translate-y-0.5 md:text-xl"
            >
                bS
            </span>
            <span class="flex flex-col leading-tight">
                <span class="font-display text-xl font-semibold text-slate-900 md:text-2xl"
                    >bStats</span
                >
                <span
                    class="text-xs font-medium tracking-wide text-slate-500 uppercase md:hidden lg:inline"
                >
                    Open source metrics
                </span>
            </span>
        </a>

        <NavigationMenu.Root>
            <NavigationMenu.List class="hidden md:flex">
                <NavigationMenu.Item>
                    <a href={resolve('/plugin-list')} class="transition hover:text-slate-900"
                        >Plugin List</a
                    >
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                    <a href={resolve('/docs')} class="transition hover:text-slate-900">Docs</a>
                </NavigationMenu.Item>
                {#if globalSoftware.length}
                    <NavigationMenu.Item value="global-stats">
                        <NavigationMenu.Trigger>
                            Global Stats
                            <IconChevronDown
                                size={16}
                                class="transition-transform duration-100 group-data-[state=open]:rotate-180"
                            />
                        </NavigationMenu.Trigger>
                        <NavigationMenu.Content align="center">
                            <ul class="space-y-1.5 text-sm">
                                {#each globalSoftware as software (software.name)}
                                    <li>
                                        <NavigationMenu.Link
                                            href={resolve(`/global/${software.url}`)}
                                        >
                                            <span>{software.name}</span>
                                        </NavigationMenu.Link>
                                    </li>
                                {/each}
                            </ul>
                        </NavigationMenu.Content>
                    </NavigationMenu.Item>
                {/if}
                {#if plugins.length}
                    <NavigationMenu.Item value="my-plugins">
                        <NavigationMenu.Trigger>
                            My Plugins
                            <IconChevronDown
                                size={16}
                                class="transition-transform duration-100 group-data-[state=open]:rotate-180"
                            />
                        </NavigationMenu.Trigger>
                        <NavigationMenu.Content align="center">
                            <ul class="space-y-1.5 text-sm">
                                {#each plugins as plugin (plugin.id)}
                                    <li>
                                        <NavigationMenu.Link
                                            href={resolve(
                                                `/plugin/${plugin.software.url}/${plugin.name}`
                                            )}
                                        >
                                            <div class="gap-2">
                                                <span>{plugin.name}</span>
                                                <span class="text-xs text-slate-500">
                                                    ({plugin.software.name})
                                                </span>
                                            </div>
                                        </NavigationMenu.Link>
                                    </li>
                                {/each}
                            </ul>

                            <Button href={resolve('/add-plugin')} fullWidth class="mt-3">
                                <span>Add Plugin</span>
                            </Button>
                        </NavigationMenu.Content>
                    </NavigationMenu.Item>
                {/if}
            </NavigationMenu.List>
        </NavigationMenu.Root>

        <div class="hidden items-center gap-3 md:flex">
            {#if user}
                {#if !plugins.length}
                    <Button href={resolve('/add-plugin')}>Add Plugin</Button>
                {/if}
                <NavigationMenu.Root>
                    <NavigationMenu.List>
                        <NavigationMenu.Item value="account">
                            <NavigationMenu.Trigger
                                class="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:border-brand-200 hover:text-brand-700"
                            >
                                <span
                                    class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 font-display text-sm font-semibold text-brand-700"
                                >
                                    {usernameInitial}
                                </span>
                                <span>Account</span>
                                <IconChevronDown
                                    size={16}
                                    class="transition-transform duration-100 group-data-[state=open]:rotate-180"
                                />
                            </NavigationMenu.Trigger>
                            <NavigationMenu.Content class="w-56 text-sm" align="end">
                                <div class="mb-2 rounded-lg bg-slate-50 p-3">
                                    <p class="text-xs tracking-wide text-slate-500 uppercase">
                                        Signed in as
                                    </p>
                                    <p class="font-semibold text-slate-700">
                                        {username || 'bStats user'}
                                    </p>
                                </div>
                                <ul class="space-y-1">
                                    <li>
                                        <NavigationMenu.Link href={resolve(`/author/${username}`)}>
                                            My page
                                        </NavigationMenu.Link>
                                    </li>
                                    {#if isAdmin}
                                        <li>
                                            <NavigationMenu.Link
                                                href={resolve('/admin/users')}
                                                class="block rounded-md px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
                                            >
                                                Admin
                                            </NavigationMenu.Link>
                                        </li>
                                    {/if}

                                    <li>
                                        <NavigationMenu.Link
                                            href={resolve('/change-password')}
                                            class="block rounded-md px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
                                        >
                                            Change password
                                        </NavigationMenu.Link>
                                    </li>
                                    <li>
                                        <button
                                            onclick={() => authClient.signOut()}
                                            class="block w-full appearance-none rounded-md px-3 py-2 text-start text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </NavigationMenu.Content>
                        </NavigationMenu.Item>
                    </NavigationMenu.List>
                </NavigationMenu.Root>
            {:else}
                <a
                    href={resolve('/login')}
                    class="text-sm font-semibold text-slate-600 transition hover:text-slate-900"
                    >Log in</a
                >
                <Button href={resolve('/register')}>Create account</Button>
            {/if}
        </div>

        <button
            type="button"
            onclick={toggleMobileNav}
            class="inline-flex items-center justify-center rounded-full bg-white p-2 text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 md:hidden"
            aria-expanded={mobileNavOpen}
        >
            <span class="sr-only">Toggle navigation</span>
            <svg
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
            >
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
    </div>

    {#if mobileNavOpen}
        <div
            class="mobile-nav border-t border-slate-200 bg-white/95 px-4 py-6 shadow-lg transition lg:hidden"
        >
            <div class="mx-auto flex max-w-6xl flex-col gap-6 text-base font-medium text-slate-700">
                <nav class="space-y-3">
                    <a
                        href={resolve('/plugin-list')}
                        class="block rounded-lg px-4 py-3 transition hover:bg-brand-50 hover:text-brand-700"
                    >
                        Plugin List
                    </a>
                    <a
                        href={resolve('/docs')}
                        class="block rounded-lg px-4 py-3 transition hover:bg-brand-50 hover:text-brand-700"
                    >
                        Docs
                    </a>
                    {#if globalSoftware.length}
                        <div class="rounded-2xl bg-slate-50 p-4">
                            <p class="text-xs tracking-wide text-slate-500 uppercase">
                                Global Stats
                            </p>
                            <ul class="mt-3 space-y-2 text-sm">
                                {#each globalSoftware as software (software.name)}
                                    <li>
                                        <a
                                            href={resolve(`/global/${software.url}`)}
                                            class="flex items-center justify-between rounded-lg bg-white px-3 py-2 shadow-sm transition hover:text-brand-700"
                                        >
                                            <span>{software.name}</span>
                                            <IconChevronRight size={14} class=" text-brand-500" />
                                        </a>
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    {/if}
                </nav>

                {#if user}
                    <div class="space-y-2">
                        {#if plugins.length}
                            <div class="rounded-2xl bg-slate-50 p-4">
                                <p class="text-xs tracking-wide text-slate-500 uppercase">
                                    My Plugins
                                </p>
                                <ul class="mt-3 space-y-2 text-sm">
                                    {#each plugins as plugin (plugin.id)}
                                        <li>
                                            <a
                                                href={resolve(
                                                    `/plugin/${plugin.software.url}/${plugin.name}`
                                                )}
                                                class="flex items-center justify-between gap-1 truncate rounded-lg bg-white px-3 py-2 shadow-sm transition hover:text-brand-700"
                                            >
                                                <div class="truncate">
                                                    {plugin.name}
                                                    <span
                                                        class="text-xs tracking-wide text-slate-500 uppercase"
                                                    >
                                                        ({plugin.software.name})
                                                    </span>
                                                </div>
                                                <IconChevronRight
                                                    size={14}
                                                    class="shrink-0 text-brand-500"
                                                />
                                            </a>
                                        </li>
                                    {/each}
                                </ul>
                            </div>
                        {/if}
                        <Button href={resolve('/add-plugin')} fullWidth>
                            <span>Add Plugin</span>
                        </Button>
                        <a
                            href={resolve(`/author/${username}`)}
                            class="block rounded-lg border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
                        >
                            My page
                        </a>
                        {#if isAdmin}
                            <a
                                href={resolve('/admin/users')}
                                class="block rounded-lg border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
                            >
                                Admin
                            </a>
                        {/if}
                        <a
                            href={resolve('/change-password')}
                            class="block rounded-lg border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
                        >
                            Change password
                        </a>
                        <button
                            onclick={() => {
                                authClient.signOut();
                                closeMobileNav();
                            }}
                            class="block w-full appearance-none rounded-lg border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
                        >
                            Logout
                        </button>
                    </div>
                {:else}
                    <div class="flex flex-col gap-3">
                        <a
                            href={resolve('/login')}
                            class="block rounded-lg border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
                        >
                            Log in
                        </a>
                        <Button href={resolve('/register')} fullWidth>Create account</Button>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</header>
