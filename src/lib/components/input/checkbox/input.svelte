<script lang="ts">
    import { Checkbox, useId } from 'bits-ui';
    import type { Snippet } from 'svelte';

    type Props = Checkbox.RootProps & {
        children?: Snippet<[{ checked: boolean; indeterminate: boolean }]>;
        label?: Snippet | string;
        labelClass?: string;
    };

    let {
        id = useId(),
        checked = $bindable(false),
        children: customChildren,
        class: className,
        ...restProps
    }: Props = $props();
</script>

<Checkbox.Root
    {id}
    bind:checked
    class={[
        // Base: match other inputs (border, bg, radius, shadow, transition)
        'peer inline-flex size-5 items-center justify-center rounded-md border border-slate-200 dark:border-dark-600',
        'bg-white text-white shadow-sm transition-colors dark:bg-dark-700',
        // Hover
        'hover:border-slate-300 dark:hover:border-dark-400',
        // Focus
        'outline-none focus-visible:border-brand-300 focus-visible:ring-2 focus-visible:ring-brand-200 dark:focus-visible:border-brand-600 dark:focus-visible:ring-brand-900',
        // Disabled
        'disabled:cursor-not-allowed disabled:opacity-50',
        // States from Bits (data-state = unchecked | checked | indeterminate)
        'data-[state=unchecked]:border-slate-200 data-[state=unchecked]:bg-white dark:data-[state=unchecked]:border-dark-600 dark:data-[state=unchecked]:bg-dark-700',
        // Checked: brand bg + border, white icon
        'data-[state=checked]:border-brand-600 data-[state=checked]:bg-brand-600',
        'data-[state=checked]:hover:bg-brand-500',
        // Indeterminate: same as checked visuals
        'data-[state=indeterminate]:border-brand-600 data-[state=indeterminate]:bg-brand-600',
        'data-[state=indeterminate]:hover:bg-brand-500',
        // Error (when consumer passes aria-invalid="true")
        'aria-[invalid=true]:border-rose-300 aria-[invalid=true]:focus-visible:ring-rose-200',
        className
    ]}
    {...restProps}
>
    {#snippet children({ checked, indeterminate })}
        {#if customChildren}
            {@render customChildren({ checked, indeterminate })}
        {:else}
            <div class="inline-flex items-center justify-center text-white">
                {#if indeterminate}
                    <svg
                        class="h-4 w-4"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            d="M2.5 7.5H12.5"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                        />
                    </svg>
                {:else if checked}
                    <svg
                        class="h-4 w-4"
                        viewBox="0 0 15 15"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M11.467 3.727c.289.189.37.576.181.865l-4.25 6.5a.8.8 0 0 1-.444.278.8.8 0 0 1-.5-.158L3.704 8.712a.6.6 0 0 1 .858-.883l2.19 2.085 3.85-5.886a.6.6 0 0 1 .864-.301Z"
                        />
                    </svg>
                {/if}
            </div>
        {/if}
    {/snippet}
</Checkbox.Root>
