<script lang="ts">
    import { Button } from 'bits-ui';
    import type { Snippet } from 'svelte';
    import type { HTMLButtonAttributes } from 'svelte/elements';

    interface Props {
        label: string;
        active?: boolean;
        icon: Snippet;
        description?: string;
    }

    let {
        label,
        active = false,
        disabled,
        icon,
        description,
        ...restProps
    }: Props & HTMLButtonAttributes = $props();
</script>

<Button.Root
    class={[
        'flex h-full flex-col gap-4 rounded-2xl border p-4 text-left transition focus-visible:ring-2 focus-visible:ring-brand-500/70 focus-visible:ring-offset-2 focus-visible:outline-none dark:focus-visible:ring-offset-dark-900',
        {
            'border-brand-300 bg-brand-50 text-brand-800 shadow-sm dark:border-brand-700 dark:bg-brand-950/50 dark:text-brand-300':
                active,
            'border-slate-200 bg-white shadow-sm hover:border-brand-200 hover:shadow-md dark:border-dark-700 dark:bg-dark-800 dark:hover:border-dark-600':
                !active && !disabled,
            'cursor-not-allowed opacity-50': disabled && !active,
            'cursor-pointer': !disabled
        }
    ]}
    {...restProps}
    onclick={disabled ? undefined : restProps.onclick}
>
    <div class="flex items-center gap-4">
        <div
            aria-hidden="true"
            class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 p-2 dark:bg-dark-700"
        >
            {@render icon()}
        </div>

        <span class="font-semibold text-slate-900 dark:text-slate-100">{label}</span>
    </div>
    {#if description}
        <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{description}</p>
    {/if}
</Button.Root>
