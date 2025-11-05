<script lang="ts">
    import type { Snippet } from 'svelte';

    export type StepStatus = 'locked' | 'active' | 'done';

    interface Props {
        index: number;
        title: string;
        status?: StepStatus;
        children: Snippet;
    }

    let { index, title, status = 'locked', children }: Props = $props();

    let root = $state<HTMLElement | null>(null);

    const statusClasses = $derived([
        'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 space-y-5 transition-shadow',
        {
            'opacity-60': status === 'locked',
            'ring-2 ring-brand-400/50 shadow-md': status === 'active'
        }
    ]);

    $effect(() => {
        if (status === 'active' && index !== 1) {
            // Scroll to root element when this step becomes active but with a bit of offset
            const offset = root ? root.getBoundingClientRect().top + window.scrollY - 120 : 0;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    });
</script>

<div bind:this={root} class={statusClasses} aria-disabled={status === 'locked'}>
    <div class="flex items-center gap-4">
        {#if status === 'done'}
            <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white"
            >
                <svg viewBox="0 0 24 24" class="h-6 w-6" aria-hidden="true">
                    <path
                        fill="currentColor"
                        d="M9.707 16.293a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 1.414-1.414L9 13.586l8.293-8.293a1 1 0 0 1 1.414 1.414z"
                    />
                </svg>
            </div>
        {:else}
            <div
                class={[
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold',
                    {
                        'border-brand-300 text-brand-700': status === 'active',
                        'border-slate-300 text-slate-500': status !== 'active'
                    }
                ]}
            >
                {index}
            </div>
        {/if}

        <h2 class="font-display text-xl font-semibold text-slate-900">{title}</h2>
    </div>

    {#if status !== 'locked'}
        <div class="text-sm leading-relaxed text-slate-600">
            {@render children()}
        </div>
    {/if}
</div>
