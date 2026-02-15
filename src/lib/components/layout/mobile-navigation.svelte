<script lang="ts">
    import { resolve } from '$app/paths';
    import Button from '$lib/components/button.svelte';
    import IconChevronRight from '@tabler/icons-svelte/icons/chevron-right';

    import { onNavigate } from '$app/navigation';
    import { authClient } from '$lib/auth.client';
    import Header from '$lib/components/layout/header.svelte';
    import type { ComponentProps } from 'svelte';
    import { Dialog } from 'bits-ui';
    import { fade, fly } from 'svelte/transition';
    import IconMenu from '@tabler/icons-svelte/icons/menu-2';
    import IconX from '@tabler/icons-svelte/icons/x';

    onNavigate(() => {
        // When navigating to another page (i.e. clicking a link), close the mobile navigation
        // because as a SPA a navigation does not reload the page
        open = false;
    });

    interface Props {
        allSoftware: ComponentProps<typeof Header>['allSoftware'];
        myPlugins: ComponentProps<typeof Header>['myPlugins'];
        user: ComponentProps<typeof Header>['user'];
        open?: boolean;
    }

    let { allSoftware, myPlugins, user, open = $bindable(false) }: Props = $props();

    const globalSoftware = $derived(
        allSoftware?.filter((software) => software && software.globalPlugin)
    );
</script>

<Dialog.Root bind:open>
    <Dialog.Trigger
        class="inline-flex items-center justify-center rounded-full bg-white p-2 text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 active:scale-95 md:hidden dark:bg-dark-700 dark:text-slate-300 dark:ring-dark-600 dark:hover:bg-dark-700 dark:hover:text-slate-200"
    >
        <span class="sr-only">{open ? 'Close' : 'Open'} navigation</span>
        {#if open}
            <IconX size={24} />
        {:else}
            <IconMenu size={24} />
        {/if}
    </Dialog.Trigger>
    <Dialog.Portal>
        <Dialog.Overlay forceMount>
            {#snippet child({ props, open: isOpen })}
                {#if isOpen}
                    <div
                        {...props}
                        class="fixed inset-x-0 top-[81px] bottom-0 z-40 bg-black/65"
                        transition:fade={{ duration: 150 }}
                    ></div>
                {/if}
            {/snippet}
        </Dialog.Overlay>
        <Dialog.Content forceMount>
            {#snippet child({ props, open: isOpen })}
                {#if isOpen}
                    <nav
                        {...props}
                        transition:fly={{ y: -10, duration: 200 }}
                        class="mobile-nav fixed inset-x-0 top-[81px] z-50 max-h-[calc(100vh-81px)] overflow-y-auto border-t border-slate-200 bg-white py-6 shadow-lg dark:border-dark-700 dark:bg-dark-800"
                    >
                        <div
                            class="mx-auto flex max-w-6xl flex-col gap-7 px-6 text-base font-medium text-slate-700 dark:text-slate-300"
                        >
                            {#if !user}
                                <section>
                                    <h2>Account</h2>
                                    <div class="link-container">
                                        <a href={resolve('/login')} class="link link-wrapper">
                                            Log in
                                        </a>
                                        <a href={resolve('/register')} class="link link-wrapper">
                                            Create account
                                        </a>
                                    </div>
                                </section>
                            {/if}

                            {#if myPlugins && myPlugins.length}
                                <section>
                                    <h2>My plugins</h2>
                                    <ul class="link-container">
                                        {#each myPlugins as plugin (plugin.id)}
                                            <li class="link-wrapper">
                                                <a
                                                    href={resolve(
                                                        `/plugin/${plugin.software.url}/${plugin.name}`
                                                    )}
                                                    class="link"
                                                >
                                                    <div class="truncate">
                                                        {plugin.name}
                                                        <span
                                                            class="text-xs tracking-wide text-slate-500 dark:text-slate-400"
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
                                </section>
                            {/if}

                            {#if user}
                                <Button href={resolve('/add-plugin')} fullWidth>
                                    <span>Add plugin</span>
                                </Button>
                            {/if}

                            {#if globalSoftware && globalSoftware.length}
                                <section>
                                    <h2>Global stats</h2>
                                    <ul class="link-container">
                                        {#each globalSoftware as software (software.name)}
                                            <li class="link-wrapper">
                                                <a
                                                    href={resolve(`/global/${software.url}`)}
                                                    class="link"
                                                >
                                                    <span>{software.name}</span>
                                                    <IconChevronRight
                                                        size={14}
                                                        class=" text-brand-500"
                                                    />
                                                </a>
                                            </li>
                                        {/each}
                                    </ul>
                                </section>
                            {/if}

                            <section>
                                <h2>Navigation</h2>
                                <div class="link-container">
                                    <a href={resolve('/plugin-list')} class="link link-wrapper">
                                        Plugin list
                                    </a>
                                    <a href={resolve('/docs')} class="link link-wrapper">
                                        Documentation
                                    </a>
                                    {#if user?.role === 'admin'}
                                        <a href={resolve('/admin/users')} class="link link-wrapper">
                                            Admin
                                        </a>
                                    {/if}
                                </div>
                            </section>

                            {#if user}
                                <section>
                                    <h2>Account</h2>
                                    <div class="link-container">
                                        <a
                                            href={resolve(`/author/${user.name}`)}
                                            class="link link-wrapper"
                                        >
                                            My page
                                        </a>
                                        <a
                                            href={resolve('/change-username')}
                                            class="link link-wrapper"
                                        >
                                            Change username
                                        </a>
                                        <a
                                            href={resolve('/change-password')}
                                            class="link link-wrapper"
                                        >
                                            Change password
                                        </a>
                                        <button
                                            onclick={() => {
                                                authClient.signOut();
                                                open = false;
                                            }}
                                            class="link link-wrapper"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </section>
                            {/if}
                        </div>
                    </nav>
                {/if}
            {/snippet}
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>

<style lang="postcss">
    @reference "$lib/../app.css";

    .link-container {
        @apply mt-2 rounded-xl text-sm shadow-sm;
    }

    .link-wrapper {
        @apply w-full overflow-hidden border border-slate-200 first:rounded-t-xl last:rounded-b-xl dark:border-dark-700;
    }

    .link {
        @apply flex w-full items-center justify-between px-4 py-3 text-brand-700 transition hover:text-brand-700 focus-visible:bg-brand-100 focus-visible:text-brand-800 focus-visible:outline-none dark:text-slate-300 dark:hover:text-slate-200 dark:focus-visible:bg-dark-700 dark:focus-visible:text-slate-200;
    }
</style>
