<script lang="ts">
    import { themePreference, type ThemePreference } from '$lib/stores/theme.svelte';
    import IconSun from '@tabler/icons-svelte/icons/sun';
    import IconMoon from '@tabler/icons-svelte/icons/moon';
    import IconDeviceDesktop from '@tabler/icons-svelte/icons/device-desktop';

    const modes: { value: ThemePreference; label: string }[] = [
        { value: 'system', label: 'System theme' },
        { value: 'light', label: 'Light theme' },
        { value: 'dark', label: 'Dark theme' }
    ];

    function cycle() {
        const currentIndex = modes.findIndex((m) => m.value === themePreference.current);
        const nextIndex = (currentIndex + 1) % modes.length;
        themePreference.current = modes[nextIndex].value;
    }

    const currentLabel = $derived(
        modes.find((m) => m.value === themePreference.current)?.label ?? 'System theme'
    );
</script>

<button
    onclick={cycle}
    class="inline-flex items-center justify-center rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-brand-500/70 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-slate-400 dark:hover:bg-dark-700 dark:hover:text-slate-200"
    title={currentLabel}
    aria-label={currentLabel}
>
    {#if themePreference.current === 'light'}
        <IconSun size={20} />
    {:else if themePreference.current === 'dark'}
        <IconMoon size={20} />
    {:else}
        <IconDeviceDesktop size={20} />
    {/if}
</button>
