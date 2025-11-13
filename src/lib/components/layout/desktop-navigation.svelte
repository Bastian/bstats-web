<script lang="ts">
    import { resolve } from '$app/paths';
    import Header from '$lib/components/layout/header.svelte';
    import { NavigationMenu } from '$lib/components/navigation-menu';
    import type { ComponentProps } from 'svelte';
    import IconChevronDown from '@tabler/icons-svelte/icons/chevron-down';
    import Button from '$lib/components/button.svelte';
    import { authClient } from '$lib/auth.client';

    interface Props {
        allSoftware: ComponentProps<typeof Header>['allSoftware'];
        myPlugins: ComponentProps<typeof Header>['myPlugins'];
        user: ComponentProps<typeof Header>['user'];
    }

    let { allSoftware, myPlugins, user }: Props = $props();

    const globalSoftware = $derived(
        allSoftware?.filter((software) => software && software.globalPlugin)
    );

    const usernameInitial = $derived(user?.name ? user.name.charAt(0).toUpperCase() : '🙂');
</script>

<NavigationMenu.Root>
    <NavigationMenu.List class="hidden md:flex">
        <NavigationMenu.Item>
            <a href={resolve('/plugin-list')} class="transition hover:text-slate-900">
                Plugin list
            </a>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
            <a href={resolve('/docs')} class="transition hover:text-slate-900">Docs</a>
        </NavigationMenu.Item>
        {#if globalSoftware && globalSoftware.length}
            <NavigationMenu.Item value="global-stats">
                <NavigationMenu.Trigger>
                    Global stats
                    <IconChevronDown
                        size={16}
                        class="transition-transform duration-100 group-data-[state=open]:rotate-180"
                    />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content align="center">
                    <ul class="space-y-1.5 text-sm">
                        {#each globalSoftware as software (software.name)}
                            <li>
                                <NavigationMenu.Link href={resolve(`/global/${software.url}`)}>
                                    <span>{software.name}</span>
                                </NavigationMenu.Link>
                            </li>
                        {/each}
                    </ul>
                </NavigationMenu.Content>
            </NavigationMenu.Item>
        {/if}
        {#if myPlugins && myPlugins.length}
            <NavigationMenu.Item value="my-plugins">
                <NavigationMenu.Trigger>
                    My plugins
                    <IconChevronDown
                        size={16}
                        class="transition-transform duration-100 group-data-[state=open]:rotate-180"
                    />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content align="center">
                    <ul class="space-y-1.5 text-sm">
                        {#each myPlugins as plugin (plugin.id)}
                            <li>
                                <NavigationMenu.Link
                                    href={resolve(`/plugin/${plugin.software.url}/${plugin.name}`)}
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
                        <span>Add plugin</span>
                    </Button>
                </NavigationMenu.Content>
            </NavigationMenu.Item>
        {/if}
    </NavigationMenu.List>
</NavigationMenu.Root>

<div class="hidden items-center gap-3 md:flex">
    {#if user}
        {#if !myPlugins || !myPlugins.length}
            <Button href={resolve('/add-plugin')}>Add plugin</Button>
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
                                {user.name || 'bStats user'}
                            </p>
                        </div>
                        <ul class="space-y-1">
                            <li>
                                <NavigationMenu.Link href={resolve(`/author/${user.name}`)}>
                                    My page
                                </NavigationMenu.Link>
                            </li>
                            {#if user.role === 'admin'}
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
            class="text-sm font-semibold text-slate-600 transition hover:text-slate-900">Log in</a
        >
        <Button href={resolve('/register')}>Create account</Button>
    {/if}
</div>
