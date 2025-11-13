<script lang="ts">
    import type { Snippet } from 'svelte';
    import { accessibilityPreferences } from '$lib/stores/accessibility';
    import IconAccessible from '@tabler/icons-svelte/icons/accessible';
    import IconAccessibleOff from '@tabler/icons-svelte/icons/accessible-off';

    interface Props {
        title: string;
        chartId: string;
        colSpan?: 'single' | 'double';
        children: Snippet;
        supportsPatterns?: boolean;
    }

    let { title, chartId, colSpan = 'single', children, supportsPatterns }: Props = $props();

    const colClass =
        colSpan === 'double' ? 'col-span-1 min-w-0 md:col-span-2' : 'col-span-1 min-w-0';
</script>

<article id={chartId} class="{colClass} rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div class="flex items-start justify-between gap-4 px-5 pt-5">
        <div class="flex flex-col gap-2">
            <h3 class="font-display text-lg font-semibold text-slate-900">
                {title}
            </h3>
        </div>
        <div class="flex items-center gap-2">
            {#if supportsPatterns}
                <button
                    onclick={() => {
                        accessibilityPreferences.current = {
                            ...accessibilityPreferences.current,
                            showChartPatterns: !accessibilityPreferences.current.showChartPatterns
                        };
                    }}
                    class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-1 py-1 text-xs font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
                    title={accessibilityPreferences.current.showChartPatterns
                        ? 'Disable patterns for color blindness'
                        : 'Enable patterns for color blindness'}
                    aria-label={accessibilityPreferences.current.showChartPatterns
                        ? 'Disable patterns for color blindness'
                        : 'Enable patterns for color blindness'}
                >
                    {#if accessibilityPreferences.current.showChartPatterns}
                        <IconAccessible class="h-5 w-5" />
                    {:else}
                        <IconAccessibleOff class="h-5 w-5" />
                    {/if}
                </button>
            {/if}
        </div>
    </div>
    <div class="px-5 pt-4 pb-6">
        <div class="min-w-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-1">
            {@render children()}
        </div>
    </div>
</article>
