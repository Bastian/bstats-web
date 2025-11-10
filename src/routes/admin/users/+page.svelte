<script lang="ts">
    import { onMount } from 'svelte';
    import Badge from '$lib/components/Badge.svelte';
    import Button from '$lib/components/Button.svelte';
    import PageHero from '$lib/components/PageHero.svelte';
    import Pagination from '$lib/components/Pagination.svelte';
    import { Table } from '$lib/components/table';
    import { authClient } from '$lib/auth.client.js';
    import type { PageData } from './$types';
    import type { User } from 'better-auth';
    import { SvelteURLSearchParams } from 'svelte/reactivity';

    const PAGE_SIZE = 15;

    type AdminUser = User & {
        username?: string | null;
        displayUsername?: string | null;
        role?: string | null;
        banned?: boolean | null;
        banReason?: string | null;
        banExpires?: string | null;
    };

    let { data }: { data: PageData } = $props();

    let users = $state<AdminUser[]>([]);
    let total = $state(0);
    let loading = $state(true);
    let overallError = $state<string | null>(null);
    let successMessage = $state<string | null>(null);
    let lastReset = $state<{
        userId: string;
        password: string;
        name: string;
    } | null>(null);
    let currentPage = $state(Math.max(1, data.page ?? 1));
    let searchInput = $state(data.search ?? '');
    let activeSearch = $state(data.search ?? '');
    let pendingAction = $state<{ userId: string; type: 'ban' | 'unban' | 'reset' } | null>(null);
    let watchersReady = $state(false);
    let lastParams = $derived<{ page: number; search: string }>({
        page: currentPage,
        search: activeSearch
    });

    const rolesFor = (role?: string | null) =>
        role
            ? role
                  .split(',')
                  .map((value) => value.trim())
                  .filter(Boolean)
            : [];

    const displayNameFor = (user: AdminUser) =>
        user.displayUsername ?? user.username ?? user.name ?? user.email ?? user.id;

    function formatTimestamp(value?: string | null) {
        if (!value) return null;
        const timestamp = new Date(value);
        if (Number.isNaN(timestamp.valueOf())) return null;
        return timestamp.toLocaleString();
    }

    function updateUrlParams(page: number, search: string) {
        if (typeof window === 'undefined') return;
        const params = new SvelteURLSearchParams();
        if (page > 1) {
            params.set('page', String(page));
        }
        if (search) {
            params.set('search', search);
        }
        const query = params.toString();
        const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}`;
        window.history.replaceState({}, '', nextUrl);
    }

    function generateRandomPassword(length = 16) {
        const characters = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789';
        if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
            const values = new Uint32Array(length);
            crypto.getRandomValues(values);
            return Array.from(values, (value) => characters[value % characters.length]).join('');
        }
        return Array.from(
            { length },
            () => characters[Math.floor(Math.random() * characters.length)]
        ).join('');
    }

    async function fetchUsers(pageArg = currentPage, searchArg = activeSearch) {
        loading = true;
        overallError = null;
        try {
            const response = await authClient.admin.listUsers({
                query: {
                    limit: PAGE_SIZE,
                    offset: (pageArg - 1) * PAGE_SIZE,
                    ...(searchArg
                        ? {
                              searchValue: searchArg,
                              searchField: 'name' as const,
                              searchOperator: 'contains' as const
                          }
                        : {})
                }
            });

            if (response?.error) {
                throw new Error(response.error.message ?? 'Failed to load users.');
            }

            const basePayload =
                response && typeof response === 'object' && 'data' in response && response.data
                    ? response.data
                    : response;

            const payload = (basePayload ?? {}) as {
                users?: AdminUser[];
                total?: number;
            };

            users = (payload.users ?? []) as AdminUser[];
            total = payload.total ?? users.length;
            lastParams = { page: pageArg, search: searchArg };
            updateUrlParams(pageArg, searchArg);
        } catch (cause) {
            console.error('Failed to fetch users', cause);
            overallError =
                cause instanceof Error ? cause.message : 'Failed to load users. Please try again.';
        } finally {
            loading = false;
        }
    }

    async function handleBan(user: AdminUser) {
        const reason = window.prompt('Ban reason (optional)', user.banReason ?? undefined);
        if (reason === null) return;

        pendingAction = { userId: user.id, type: 'ban' };
        successMessage = null;
        overallError = null;

        try {
            const response = await authClient.admin.banUser({
                userId: user.id,
                ...(reason && reason.trim() ? { banReason: reason.trim() } : {})
            });

            if (response?.error) {
                throw new Error(response.error.message ?? 'Failed to ban user.');
            }

            await fetchUsers();
            successMessage = `${displayNameFor(user)} has been banned.`;
        } catch (cause) {
            console.error(`Failed to ban user ${user.id}`, cause);
            overallError =
                cause instanceof Error ? cause.message : 'Failed to ban user. Please try again.';
        } finally {
            pendingAction = null;
        }
    }

    async function handleUnban(user: AdminUser) {
        pendingAction = { userId: user.id, type: 'unban' };
        successMessage = null;
        overallError = null;

        try {
            const response = await authClient.admin.unbanUser({
                userId: user.id
            });

            if (response?.error) {
                throw new Error(response.error.message ?? 'Failed to unban user.');
            }

            await fetchUsers();
            successMessage = `${displayNameFor(user)} has been unbanned.`;
        } catch (cause) {
            console.error(`Failed to unban user ${user.id}`, cause);
            overallError =
                cause instanceof Error ? cause.message : 'Failed to unban user. Please try again.';
        } finally {
            pendingAction = null;
        }
    }

    async function handleResetPassword(user: AdminUser) {
        const newPassword = generateRandomPassword();

        pendingAction = { userId: user.id, type: 'reset' };
        overallError = null;

        try {
            const response = await authClient.admin.setUserPassword({
                userId: user.id,
                newPassword
            });

            if (response?.error) {
                throw new Error(response.error.message ?? 'Failed to reset password.');
            }

            await fetchUsers();
            lastReset = {
                userId: user.id,
                password: newPassword,
                name: displayNameFor(user)
            };
            successMessage = `Password reset for ${displayNameFor(user)}.`;
        } catch (cause) {
            console.error(`Failed to reset password for user ${user.id}`, cause);
            overallError =
                cause instanceof Error
                    ? cause.message
                    : 'Failed to reset password. Please try again.';
        } finally {
            pendingAction = null;
        }
    }

    function handleSearchSubmit(event: SubmitEvent) {
        event.preventDefault();
        const nextSearch = searchInput.trim();
        if (nextSearch === activeSearch && currentPage === 1) return;
        activeSearch = nextSearch;
        currentPage = 1;
    }

    function handleClearSearch() {
        if (!searchInput && !activeSearch) return;
        searchInput = '';
        activeSearch = '';
        currentPage = 1;
    }

    function isPending(userId: string, type: 'ban' | 'unban' | 'reset') {
        return pendingAction?.userId === userId && pendingAction?.type === type;
    }

    function copyPassword(password: string, event: MouseEvent) {
        const button = event.currentTarget as HTMLButtonElement;
        if (typeof navigator === 'undefined' || !navigator.clipboard) {
            const originalLabel = button.textContent;
            button.textContent = 'Not supported';
            setTimeout(() => {
                if (originalLabel) button.textContent = originalLabel;
            }, 1500);
            return;
        }
        navigator.clipboard
            .writeText(password)
            .then(() => {
                const originalText = button.textContent;
                button.textContent = 'Copied';
                setTimeout(() => {
                    if (originalText) button.textContent = originalText;
                }, 1500);
            })
            .catch((err) => {
                console.error('Failed to copy password', err);
                const originalText = button.textContent;
                button.textContent = 'Copy failed';
                setTimeout(() => {
                    if (originalText) button.textContent = originalText;
                }, 1500);
            });
    }

    onMount(async () => {
        await fetchUsers();
        watchersReady = true;
    });

    $effect(() => {
        if (!watchersReady) return;

        if (currentPage < 1) {
            currentPage = 1;
            return;
        }

        if (currentPage !== lastParams.page || activeSearch !== lastParams.search) {
            fetchUsers(currentPage, activeSearch);
        }
    });
</script>

<svelte:head>
    <title>bStats - User Management</title>
    <meta
        name="description"
        content="Manage bStats users, reset passwords, and handle bans from a single admin dashboard."
    />
</svelte:head>

<main class="pb-24">
    <PageHero>
        {#snippet badge()}<Badge>Admin</Badge>{/snippet}
        {#snippet title()}User Management{/snippet}
        {#snippet content()}
            View all registered users, ban or unban accounts, and generate temporary passwords for
            account recovery.
        {/snippet}
    </PageHero>

    <section class="doc-container mt-12 space-y-6">
        <form
            class="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4"
            onsubmit={handleSearchSubmit}
        >
            <div class="flex-1 space-y-2">
                <label class="input-label" for="adminUserSearch">Search users</label>
                <input
                    id="adminUserSearch"
                    type="text"
                    placeholder="Search by display name"
                    class="input-control"
                    bind:value={searchInput}
                />
            </div>
            <div class="flex gap-3">
                <Button type="submit" size="medium">Apply</Button>
                <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-200 hover:text-brand-600"
                    onclick={handleClearSearch}
                >
                    Clear
                </button>
            </div>
        </form>

        {#if overallError}
            <div class="doc-callout border-rose-200 bg-rose-50 text-rose-700">{overallError}</div>
        {/if}

        {#if successMessage}
            <div class="doc-callout border-emerald-200 bg-emerald-50 text-emerald-700">
                {successMessage}
            </div>
        {/if}

        {#if lastReset}
            <div class="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <p class="font-semibold">{lastReset.name}</p>
                <p class="mt-1 font-mono text-base break-all text-amber-900">
                    {lastReset.password}
                </p>
                <p class="mt-2 text-xs text-amber-700">
                    Share this password securely with the user; they should change it after signing
                    in.
                </p>
                <button
                    type="button"
                    class="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-300 px-3 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
                    onclick={(event) => copyPassword(lastReset!.password, event)}
                >
                    Copy password
                </button>
            </div>
        {/if}

        <div class="overflow-x-auto">
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>User</Table.HeaderCell>
                        <Table.HeaderCell>Email</Table.HeaderCell>
                        <Table.HeaderCell>Roles</Table.HeaderCell>
                        <Table.HeaderCell>Status</Table.HeaderCell>
                        <Table.HeaderCell align="right">Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {#if loading}
                        <Table.Row>
                            <Table.Cell colspan={5} class="py-8 text-center text-slate-500">
                                Loading users…
                            </Table.Cell>
                        </Table.Row>
                    {:else if users.length === 0}
                        <Table.Row>
                            <Table.Cell colspan={5} class="py-8 text-center text-slate-500">
                                No users found.
                            </Table.Cell>
                        </Table.Row>
                    {:else}
                        {#each users as user (user.id)}
                            <Table.Row class={user.banned ? 'bg-rose-50/60' : ''}>
                                <Table.Cell>
                                    <div class="font-semibold text-slate-900">
                                        {displayNameFor(user)}
                                    </div>
                                    <div class="mt-1 text-xs text-slate-500">
                                        {user.username ? `@${user.username}` : '—'}
                                    </div>
                                    {#if user.id}
                                        <div class="mt-1 font-mono text-[11px] text-slate-400">
                                            {user.id}
                                        </div>
                                    {/if}
                                </Table.Cell>
                                <Table.Cell class="text-slate-600">
                                    {user.email ?? '—'}
                                </Table.Cell>
                                <Table.Cell class="text-slate-600">
                                    {#if rolesFor(user.role).length}
                                        {rolesFor(user.role).join(', ')}
                                    {:else}
                                        —
                                    {/if}
                                </Table.Cell>
                                <Table.Cell>
                                    {#if user.banned}
                                        <div class="text-sm font-semibold text-rose-700">
                                            Banned
                                        </div>
                                        {#if user.banReason}
                                            <div class="text-xs text-rose-600">
                                                {user.banReason}
                                            </div>
                                        {/if}
                                        {#if user.banExpires}
                                            {#if formatTimestamp(user.banExpires)}
                                                <div class="text-[11px] text-rose-500">
                                                    Expires {formatTimestamp(user.banExpires)}
                                                </div>
                                            {/if}
                                        {/if}
                                    {:else}
                                        <div class="text-sm font-semibold text-emerald-600">
                                            Active
                                        </div>
                                    {/if}
                                </Table.Cell>
                                <Table.Cell align="right">
                                    <div class="flex flex-wrap items-center justify-end gap-2">
                                        {#if user.banned}
                                            <button
                                                type="button"
                                                class="inline-flex items-center gap-2 rounded-full border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:border-emerald-300 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                                                disabled={isPending(user.id, 'unban')}
                                                onclick={() => handleUnban(user)}
                                            >
                                                {isPending(user.id, 'unban')
                                                    ? 'Unbanning…'
                                                    : 'Unban'}
                                            </button>
                                        {:else}
                                            <button
                                                type="button"
                                                class="inline-flex items-center gap-2 rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:border-rose-300 hover:text-rose-800 disabled:cursor-not-allowed disabled:opacity-50"
                                                disabled={isPending(user.id, 'ban')}
                                                onclick={() => handleBan(user)}
                                            >
                                                {isPending(user.id, 'ban') ? 'Banning…' : 'Ban'}
                                            </button>
                                        {/if}
                                        <button
                                            type="button"
                                            class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-brand-200 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                                            disabled={isPending(user.id, 'reset')}
                                            onclick={() => handleResetPassword(user)}
                                        >
                                            {isPending(user.id, 'reset')
                                                ? 'Resetting…'
                                                : 'Reset password'}
                                        </button>
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        {/each}
                    {/if}
                </Table.Body>
            </Table.Root>
        </div>

        {#if total > PAGE_SIZE}
            <Pagination count={total} perPage={PAGE_SIZE} bind:page={currentPage} />
        {/if}
    </section>
</main>
