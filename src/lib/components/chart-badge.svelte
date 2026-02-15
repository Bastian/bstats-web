<script lang="ts">
    import type { Snippet } from 'svelte';

    interface ChartBadgeProps {
        title: string;
        icon?: Snippet;
        current: string;
        record: string;
    }

    const { title, icon, current, record }: ChartBadgeProps = $props();
</script>

<article
    class="min-w-0 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm dark:border-dark-700 dark:bg-dark-800 dark:text-slate-400"
>
    <div
        class="flex items-center gap-2 text-xs tracking-[0.25em] text-slate-500 uppercase dark:text-slate-400"
    >
        {#if icon}
            {@render icon()}
        {/if}
        {title}
    </div>
    <div class="mt-2 flex items-baseline gap-3">
        <span class="font-display text-4xl font-semibold text-slate-900 dark:text-slate-100">
            {current}
        </span>
        <span class="text-[11px] tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400"
            >current</span
        >
    </div>
    <div class="mt-2 flex items-baseline gap-2">
        <div class="font-display text-sm font-semibold text-slate-600 dark:text-slate-300">
            {record}
        </div>
        <div class="mt-2 text-[11px] tracking-[0.18em] text-slate-500 uppercase">Record</div>
    </div>
</article>
