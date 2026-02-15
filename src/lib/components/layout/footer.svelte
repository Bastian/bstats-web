<script lang="ts">
    import Badge from '$lib/components/badge.svelte';
    import ThemeToggle from '$lib/components/theme-toggle.svelte';
    import { resolve } from '$app/paths';

    let { loggedIn = false } = $props<{
        loggedIn?: boolean;
    }>();
</script>

{#snippet FooterSection(title: string, links: Array<{ href: string; label: string }>)}
    <div>
        <h3
            class="text-sm font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400"
        >
            {title}
        </h3>
        <ul class="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
            {#each links as { href, label } (href)}
                <li>
                    <a
                        {href}
                        class="-m-1 rounded p-1 transition-colors hover:text-brand-800 focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:outline-none dark:hover:text-slate-200"
                    >
                        {label}
                    </a>
                </li>
            {/each}
        </ul>
    </div>
{/snippet}

<footer
    class="border-t border-slate-200 bg-white/90 backdrop-blur dark:border-dark-700 dark:bg-dark-800"
>
    <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div class="grid gap-12 md:grid-cols-3 lg:grid-cols-5">
            <div class="md:col-span-3 lg:col-span-2">
                <div class="inline-flex items-center gap-3">
                    <span
                        aria-hidden="true"
                        class="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500 font-display text-lg font-semibold text-white shadow-md"
                    >
                        bS
                    </span>
                    <div>
                        <p
                            class="font-display text-xl font-semibold text-slate-900 dark:text-slate-100"
                        >
                            bStats
                        </p>
                        <p class="text-sm text-slate-500 dark:text-slate-400">
                            Open source metrics since 2016.
                        </p>
                    </div>
                </div>
                <p class="mt-6 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    bStats started as a fun side project for my own plugins and grew into the
                    de-facto standard for Minecraft server plugin metrics.
                </p>
                <div class="mt-6 flex flex-wrap gap-3">
                    <a
                        href="https://github.com/Bastian/bStats"
                        class="rounded-full ring-offset-2 focus-visible:ring-2 focus-visible:ring-black/50 focus-visible:outline-none"
                    >
                        <Badge
                            class="bg-black text-slate-100 transition hover:brightness-110"
                            type="none"
                        >
                            <img alt="GitHub" src="/images/github-mark-white.svg" class="h-4 w-4" />
                            GitHub
                        </Badge>
                    </a>
                    <a
                        href="https://discord.gg/qTXtXuf"
                        class="rounded-full ring-offset-2 focus-visible:ring-2 focus-visible:ring-discord-blurple/50 focus-visible:outline-none"
                    >
                        <Badge
                            type="none"
                            class="bg-discord-blurple text-white transition hover:brightness-110"
                        >
                            <img
                                alt="Discord"
                                src="/images/Discord-Symbol-White.svg"
                                class="h-4 w-4"
                            />
                            Discord
                        </Badge>
                    </a>
                </div>
            </div>

            {@render FooterSection('Get started', [
                { href: resolve('/docs'), label: 'Documentation' },
                { href: resolve('/faq'), label: 'FAQ' },
                { href: resolve('/add-plugin'), label: 'Add plugin' },
                { href: resolve('/docs/custom-charts'), label: 'Custom charts' },
                { href: resolve('/docs/rest-api'), label: 'REST API' }
            ])}

            {@render FooterSection(
                'Account',
                loggedIn
                    ? [
                          { href: resolve('/add-plugin'), label: 'Add plugin' },
                          { href: resolve('/change-password'), label: 'Change password' },
                          { href: resolve('/logout'), label: 'Logout' },
                          { href: resolve('/what-is-my-plugin-id'), label: 'What is my plugin id?' }
                      ]
                    : [
                          { href: resolve('/login'), label: 'Log in' },
                          { href: resolve('/register'), label: 'Create account' }
                      ]
            )}

            {@render FooterSection('Legal & more', [
                { href: resolve('/terms-of-use'), label: 'Terms of use' },
                { href: resolve('/privacy-policy'), label: 'Privacy policy' },
                { href: resolve('/imprint'), label: 'Imprint' },
                { href: resolve('/credits'), label: 'Credits' }
            ])}
        </div>

        <div
            class="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:border-dark-700 dark:text-slate-400"
        >
            <p>
                © {new Date().getFullYear()} bStats - Made with love.
            </p>
            <ThemeToggle />
        </div>
    </div>
</footer>
