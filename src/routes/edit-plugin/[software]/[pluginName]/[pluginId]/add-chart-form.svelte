<script lang="ts">
    import { Checkbox } from '$lib/components/input/checkbox';
    import { TextInput } from '$lib/components/input/text';
    import { Control, Description, ElementField, Field, FieldErrors, Label } from 'formsnap';
    import { superForm } from 'sveltekit-superforms';
    import { zod4Client } from 'sveltekit-superforms/adapters';
    import type { PageData } from './$types';
    import { addChartSchema } from './add-chart-schema';
    import Button from '$lib/components/button.svelte';
    import { dndzone } from 'svelte-dnd-action';
    import { flip } from 'svelte/animate';

    let { schema }: { schema: PageData['addChartSchema'] } = $props();

    const form = superForm(schema, {
        // 'json' so complex fields (e.g. the reorderable barLabels array, which
        // isn't backed by named inputs) are submitted from $formData directly.
        dataType: 'json',
        validators: zod4Client(addChartSchema)
    });

    const { form: formData, enhance } = form;

    const flipDurationMs = 150;

    // Reorderable bar labels (advanced bar). Local { id, name } list with stable
    // ids for drag & drop; names are mirrored into $formData.barLabels.
    let labelItems = $state<{ id: number; name: string }[]>([]);
    let nextLabelId = 0;

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

<form class="space-y-5" method="POST" action="?/addChart" use:enhance>
    <div>
        <!-- TODO Extract in component and check https://formsnap.dev/docs/recipes/bits-ui-select for how to do this properly and accessible -->
        <Field {form} name="chartType">
            <Control>
                {#snippet children({ props })}
                    <Label
                        class="text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300"
                    >
                        Chart type
                    </Label>
                    <select class="input-control" {...props} bind:value={$formData.chartType}>
                        <option value="" disabled>Choose a chart type</option>
                        <optgroup label="Pies">
                            <option value="simple_pie">Simple pie</option>
                            <option value="advanced_pie">Advanced pie</option>
                            <option value="drilldown_pie">Drilldown pie</option>
                        </optgroup>
                        <optgroup label="Line charts">
                            <option value="single_linechart">Single line chart</option>
                        </optgroup>
                        <optgroup label="Bar charts">
                            <option value="simple_bar">Simple bar</option>
                            <option value="advanced_bar">Advanced bar</option>
                        </optgroup>
                    </select>
                {/snippet}
            </Control>
            <FieldErrors class="text-xs text-red-700 dark:text-red-400" />
        </Field>
    </div>

    <div
        class="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-dark-700 dark:bg-dark-800/50"
    >
        <TextInput.Formsnap
            {form}
            name="chartTitle"
            label="Chart title"
            description="The display name for the chart (shown above the chart)."
            inputProps={{ placeholder: 'My chart' }}
            bind:value={$formData.chartTitle}
        />

        <TextInput.Formsnap
            {form}
            name="chartId"
            label="Chart ID"
            description="Technical ID used in code and URLs. Use camelCase or snake_case."
            inputProps={{ placeholder: 'myChart' }}
            bind:value={$formData.chartId}
        />

        {#if $formData.chartType === 'single_linechart'}
            <TextInput.Formsnap
                {form}
                name="lineName"
                label="Line name"
                description="Shown in the legend and tooltips."
                inputProps={{ placeholder: 'My line' }}
                bind:value={$formData.lineName}
            />
        {/if}

        {#if $formData.chartType === 'simple_bar' || $formData.chartType === 'advanced_bar'}
            <TextInput.Formsnap
                {form}
                name="valueName"
                label="Value axis label"
                description="Shown along the value axis (e.g. Total, Servers)."
                inputProps={{ placeholder: 'Total' }}
                bind:value={$formData.valueName}
            />
        {/if}

        {#if $formData.chartType === 'advanced_bar'}
            <div>
                <span class="input-label">Bar labels</span>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                    One label per bar, in order (1st label = 1st value your plugin sends). Drag to
                    reorder. Missing labels fall back to "Series N", extra labels are ignored.
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
                            class="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-dark-700 dark:bg-dark-800"
                        >
                            <span class="cursor-move text-slate-400 dark:text-slate-500" title="Drag to reorder">
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
                        </li>
                    {/each}
                </ul>
                <button
                    type="button"
                    class="mt-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
                    onclick={addLabel}
                >
                    + Add label
                </button>
            </div>
        {/if}
    </div>
    {#if $formData.chartType !== 'simple_bar' && $formData.chartType !== 'advanced_bar'}
    <div
        class="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-dark-700 dark:bg-dark-800/50"
    >
        <Checkbox.Formsnap
            {form}
            label="Enable filters"
            name="filterEnabled"
            bind:checked={$formData.filterEnabled}
            description="Reduce spam and abuse by enforcing input rules."
        />

        {#if $formData.filterEnabled}
            {#if $formData.chartType === 'single_linechart'}
                <TextInput.Formsnap
                    {form}
                    name="minValue"
                    label="Min value"
                    description="The minimum value per data submission. Lower values will be clamped to this value."
                    inputProps={{ type: 'number', placeholder: '0' }}
                    bind:value={$formData.minValue}
                />

                <TextInput.Formsnap
                    {form}
                    name="maxValue"
                    label="Max value"
                    description="The maximum value per data submission. Higher values will be clamped to this value."
                    inputProps={{ type: 'number', placeholder: '100' }}
                    bind:value={$formData.maxValue}
                />
            {/if}
            {#if $formData.chartType === 'advanced_pie' || $formData.chartType === 'drilldown_pie'}
                <TextInput.Formsnap
                    {form}
                    name="maxValue"
                    label="Max value"
                    description="The maximum value per data submission. Higher values will be clamped to this value."
                    inputProps={{ type: 'number', placeholder: '100' }}
                    bind:value={$formData.maxValue}
                />
            {/if}
            {#if $formData.chartType === 'simple_pie' || $formData.chartType === 'advanced_pie' || $formData.chartType === 'drilldown_pie'}
                <!-- TODO Extract in component and check https://formsnap.dev/docs/recipes/dynamic-fields for how to do this properly and accessible -->
                <Field {form} name="filter">
                    <Control>
                        <Label class="input-label">
                            {$formData.blacklistEnabled ? 'Blocklist' : 'Allowlist'}
                        </Label>

                        <Description class="text-xs text-slate-500 dark:text-slate-400">
                            {#if $formData.blacklistEnabled}
                                Entries in this list will be blocked.
                            {:else}
                                Everything <b>not</b> in this list will be blocked.
                            {/if}
                        </Description>

                        {#each $formData.filter ?? [], i (i)}
                            <ElementField {form} name={`filter[${i}]`}>
                                <div class="flex items-center gap-2">
                                    <Control>
                                        {#snippet children({ props })}
                                            <input
                                                class="input-control"
                                                type="text"
                                                {...props}
                                                bind:value={$formData.filter[i]}
                                            />
                                        {/snippet}
                                    </Control>
                                    <button
                                        type="button"
                                        onclick={() =>
                                            form.form.update((f) => {
                                                if (!('filter' in f)) {
                                                    return f;
                                                }
                                                f.filter.splice(i, 1);
                                                return f;
                                            })}
                                    >
                                        Remove
                                    </button>
                                </div>
                                <FieldErrors class="text-xs text-red-700 dark:text-red-400" />
                            </ElementField>
                        {/each}

                        <button
                            type="button"
                            onclick={() =>
                                form.form.update((f) => {
                                    if (!('filter' in f)) {
                                        return f;
                                    }
                                    (f.filter ??= []).push('');
                                    return f;
                                })}
                        >
                            + Add Entry
                        </button>
                    </Control>
                    <FieldErrors class="text-xs text-red-700 dark:text-red-400" />
                </Field>

                <Checkbox.Formsnap
                    {form}
                    label="Use blocklist mode"
                    name="blacklistEnabled"
                    bind:checked={$formData.blacklistEnabled}
                    description="Switch between allowlist and blocklist behavior."
                />

                <!--  Currently not supported by the backend for performance reasons
                <Checkbox.Formsnap
                    {form}
                    label="Use regex"
                    name="regexEnabled"
                    bind:checked={$formData.regexEnabled}
                    description="Enable regex for filter entries."
                />
                -->
            {/if}
        {/if}
    </div>
    {/if}

    <Button type="submit" fullWidth>Save chart</Button>
</form>
