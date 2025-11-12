<script lang="ts">
    import { resolve } from '$app/paths';

    import DesktopNavigation from '$lib/components/layout/DesktopNavigation.svelte';
    import MobileNavigation from '$lib/components/layout/MobileNavigation.svelte';
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
        user: App.Locals['user'];
        allSoftware?: Software[];
        myPlugins?: Plugin[];
    } = $props();
</script>

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
                <span class="font-display text-xl font-semibold text-slate-900 md:text-2xl">
                    bStats
                </span>
                <span
                    class="text-xs font-medium tracking-wide text-slate-500 uppercase md:hidden lg:inline"
                >
                    Open source metrics
                </span>
            </span>
        </a>

        <DesktopNavigation {allSoftware} {myPlugins} {user} />
        <MobileNavigation {allSoftware} {myPlugins} {user} />
    </div>
</header>
