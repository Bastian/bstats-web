<script lang="ts">
    import { Checkbox } from '$lib/components/input/checkbox';
    import { TextInput } from '$lib/components/input/text';
    import { Control, Description, ElementField, Field, FieldErrors, Label } from 'formsnap';
    import { superForm } from 'sveltekit-superforms';
    import { zod4Client } from 'sveltekit-superforms/adapters';
    import type { PageData } from './$types';
    import { addChartSchema } from './add-chart-schema';
    import Button from '$lib/components/button.svelte';

    let { schema }: { schema: PageData['addChartSchema'] } = $props();

    const form = superForm(schema, {
        validators: zod4Client(addChartSchema)
    });

    const { form: formData, enhance } = form;
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
    </div>
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

    <Button type="submit" fullWidth>Save chart</Button>
</form>
