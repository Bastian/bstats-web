<script lang="ts">
    import { TextInput } from '$lib/components/input/text';
    import type { SuperForm } from 'sveltekit-superforms';
    import { dndzone } from 'svelte-dnd-action';
    import { flip } from 'svelte/animate';
    import type { ChartFormData } from './add-chart-schema';

    // Bar chart settings shared by the add and edit forms; renders nothing for other types.
    let { form }: { form: SuperForm<ChartFormData> } = $props();

    const { form: formData, errors } = form;

    // Unique per instance, since the add and edit forms can be on the page at the same time
    const id = $props.id();
    const orientationLabelId = `${id}-orientation-label`;
    const orientationDescriptionId = `${id}-orientation-description`;

    // superforms types array errors as a SuperStructArray that can't be indexed by
    // a number; narrow to a per-index lookup (`_errors` holds array-level errors).
    const barLabelErrors = $derived(
        $errors.barLabels as ({ _errors?: string[] } & Record<number, string[]>) | undefined
    );

    const flipDurationMs = 150;

    // Bar direction: horizontal is the historical default and also what old
    // charts without a stored orientation use.
    const orientationIsVertical = $derived(
        ($formData as { orientation?: 'horizontal' | 'vertical' }).orientation === 'vertical'
    );

    // Reorderable bar labels (advanced bar). Local { id, name } list with stable
    // ids for drag & drop; names are mirrored into $formData.barLabels.
    const initialLabels = $formData.chartType === 'advanced_bar' ? $formData.barLabels : [];
    let labelItems = $state<{ id: number; name: string }[]>(
        initialLabels.map((name, index) => ({ id: index, name }))
    );
    let nextLabelId = initialLabels.length;

    // Mirror the reorderable label list into the form data so it's submitted.
    // Done from event handlers (not an $effect) to avoid a store update loop.
    function syncBarLabels() {
        if ($formData.chartType === 'advanced_bar') {
            $formData.barLabels = labelItems.map((l) => l.name);
        }
    }
    function addLabel() {
        labelItems = [...labelItems, { id: nextLabelId++, name: '' }];
        syncBarLabels();
    }
    function removeLabel(id: number) {
        labelItems = labelItems.filter((l) => l.id !== id);
        syncBarLabels();
    }
    function handleLabelConsider(e: CustomEvent) {
        labelItems = e.detail.items;
    }
    function handleLabelFinalize(e: CustomEvent) {
        labelItems = e.detail.items;
        syncBarLabels();
    }
</script>

{#if $formData.chartType === 'simple_bar' || $formData.chartType === 'advanced_bar'}
    <TextInput.Formsnap
        {form}
        name="valueName"
        label="Value axis label"
        description="Shown along the value axis (e.g. Total, Servers)."
        inputProps={{ placeholder: 'Total' }}
        bind:value={$formData.valueName}
    />

    <div>
        <span class="input-label" id={orientationLabelId}>Bar direction</span>
        <p class="text-xs text-slate-500 dark:text-slate-400" id={orientationDescriptionId}>
            Horizontal grows bars to the right and fits long category names. Vertical grows them
            upwards and suits a few short categories.
        </p>
        <div
            class="mt-2 grid grid-cols-2 gap-2"
            role="radiogroup"
            aria-labelledby={orientationLabelId}
            aria-describedby={orientationDescriptionId}
        >
            <label
                class="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition select-none focus-within:ring-2 focus-within:ring-brand-500 {orientationIsVertical
                    ? 'border-slate-200 bg-white text-slate-600 dark:border-dark-700 dark:bg-dark-800 dark:text-slate-300'
                    : 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-600 dark:bg-brand-950/50 dark:text-brand-300'}"
            >
                <input
                    class="sr-only"
                    type="radio"
                    name="orientation"
                    value="horizontal"
                    checked={!orientationIsVertical}
                    onchange={() => ($formData.orientation = 'horizontal')}
                />
                <svg
                    class="h-6 w-6 shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <rect x="3" y="5" width="16" height="3" rx="1" />
                    <rect x="3" y="10.5" width="11" height="3" rx="1" />
                    <rect x="3" y="16" width="7" height="3" rx="1" />
                </svg>
                Horizontal
            </label>
            <label
                class="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition select-none focus-within:ring-2 focus-within:ring-brand-500 {orientationIsVertical
                    ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-600 dark:bg-brand-950/50 dark:text-brand-300'
                    : 'border-slate-200 bg-white text-slate-600 dark:border-dark-700 dark:bg-dark-800 dark:text-slate-300'}"
            >
                <input
                    class="sr-only"
                    type="radio"
                    name="orientation"
                    value="vertical"
                    checked={orientationIsVertical}
                    onchange={() => ($formData.orientation = 'vertical')}
                />
                <svg
                    class="h-6 w-6 shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <rect x="5" y="10" width="3" height="10" rx="1" />
                    <rect x="10.5" y="6" width="3" height="14" rx="1" />
                    <rect x="16" y="13" width="3" height="7" rx="1" />
                </svg>
                Vertical
            </label>
        </div>
    </div>
{/if}

{#if $formData.chartType === 'advanced_bar'}
    <div>
        <span class="input-label">Bar labels</span>
        <p class="text-xs text-slate-500 dark:text-slate-400">
            One label per bar, in order (1st label = 1st value your plugin sends). Drag to reorder.
            Missing labels fall back to "Series N", extra labels are ignored.
        </p>
        <ul
            class="mt-2 space-y-2"
            use:dndzone={{ items: labelItems, flipDurationMs, dropTargetStyle: {} }}
            onconsider={handleLabelConsider}
            onfinalize={handleLabelFinalize}
        >
            {#each labelItems as item, i (item.id)}
                <li
                    animate:flip={{ duration: flipDurationMs }}
                    class="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-dark-700 dark:bg-dark-800"
                >
                    <div class="flex items-center gap-2">
                        <span
                            class="cursor-move text-slate-400 dark:text-slate-500"
                            title="Drag to reorder"
                        >
                            <svg
                                class="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M4 8h16M4 16h16"
                                />
                            </svg>
                        </span>
                        <input
                            class="input-control flex-1"
                            type="text"
                            maxlength="50"
                            placeholder={`Series ${i + 1}`}
                            value={item.name}
                            oninput={(e) => {
                                item.name = e.currentTarget.value;
                                syncBarLabels();
                            }}
                        />
                        <button
                            type="button"
                            class="text-rose-600 hover:text-rose-700"
                            title="Remove label"
                            onclick={() => removeLabel(item.id)}
                        >
                            <svg
                                class="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </button>
                    </div>
                    {#if barLabelErrors?.[i]}
                        <p class="mt-1 text-xs text-red-700 dark:text-red-400">
                            {barLabelErrors[i].join(', ')}
                        </p>
                    {/if}
                </li>
            {/each}
        </ul>
        {#if barLabelErrors?._errors}
            <p class="mt-1 text-xs text-red-700 dark:text-red-400">
                {barLabelErrors._errors.join(', ')}
            </p>
        {/if}
        <button
            type="button"
            class="mt-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
            onclick={addLabel}
        >
            + Add label
        </button>
    </div>
{/if}
