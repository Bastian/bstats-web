<script lang="ts">
    import { TextInput } from '$lib/components/input/text';
    import { Control, Field, FieldErrors, Label } from 'formsnap';
    import { superForm, type SuperForm } from 'sveltekit-superforms';
    import { zod4Client } from 'sveltekit-superforms/adapters';
    import type { PageData } from './$types';
    import type { ChartFormData } from './add-chart-schema';
    import { editChartSchema } from './edit-chart-schema';
    import { chartToFormData } from './chart-form-data';
    import { compatibleChartTypes } from './chart-schema-fields';
    import Button from '$lib/components/button.svelte';
    import BarChartFields from './bar-chart-fields.svelte';
    import ChartFilterFields from './chart-filter-fields.svelte';

    type ChartInfo = PageData['charts'][string];

    let {
        chart,
        onCancel,
        onSaved
    }: {
        chart: ChartInfo;
        onCancel: () => void;
        onSaved: () => void;
    } = $props();

    const CHART_TYPE_LABELS: Record<string, string> = {
        simple_pie: 'Simple pie',
        advanced_pie: 'Advanced pie',
        drilldown_pie: 'Drilldown pie',
        single_linechart: 'Single line chart',
        simple_bar: 'Simple bar',
        advanced_bar: 'Advanced bar'
    };

    const chartTypes = compatibleChartTypes(chart.type ?? '');

    const form = superForm(chartToFormData(chart), {
        // 'json' so complex fields (e.g. the reorderable barLabels array, which
        // isn't backed by named inputs) are submitted from $formData directly.
        dataType: 'json',
        validators: zod4Client(editChartSchema),
        onUpdated: ({ form }) => {
            // Only refresh the page when the action actually succeeded; a 500
            // can still return a valid form without a success message.
            if (form.valid && form.message) {
                onSaved();
            }
        }
    });

    const { form: formData, enhance, message } = form;

    // The shared field components only touch fields both forms have, never chartUid
    const sharedForm = form as unknown as SuperForm<ChartFormData>;
</script>

<form class="space-y-5" method="POST" action="?/editChart" use:enhance>
    <input type="hidden" name="chartUid" value={chart.uid ?? 0} />
    <div>
        <Field {form} name="chartType">
            <Control>
                {#snippet children({ props })}
                    <Label
                        class="text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300"
                    >
                        Chart type
                    </Label>
                    <select
                        class="input-control"
                        {...props}
                        bind:value={$formData.chartType}
                        disabled={chart.isDefault || chartTypes.length === 1}
                    >
                        {#each chartTypes as type (type)}
                            <option value={type}>{CHART_TYPE_LABELS[type] ?? type}</option>
                        {/each}
                    </select>
                {/snippet}
            </Control>
            <FieldErrors class="text-xs text-red-700 dark:text-red-400" />
            {#if chart.isDefault}
                <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Default charts keep their chart type.
                </p>
            {:else if chartTypes.length === 1}
                <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Line charts keep their chart type.
                </p>
            {:else if $formData.chartType !== chart.type}
                <p
                    class="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
                >
                    Changing the type keeps the existing data, but historical values may not render
                    correctly until new data in the new format arrives.
                </p>
            {/if}
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

        <div>
            <TextInput.Formsnap
                {form}
                name="chartId"
                label="Chart ID"
                description={chart.isDefault
                    ? 'The chart ID of default charts is fixed.'
                    : 'Technical ID used by your plugin and in URLs. Changing it requires updating your plugin.'}
                inputProps={{ placeholder: 'myChart', disabled: chart.isDefault }}
                bind:value={$formData.chartId}
            />
            {#if !chart.isDefault && $formData.chartId !== chart.id}
                <p
                    class="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
                >
                    Your plugin must be updated to send data under the new ID. Data already
                    collected stays attached to this chart, but versions still using
                    <span class="font-mono">{chart.id}</span> will no longer send data.
                </p>
            {/if}
        </div>

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

        <BarChartFields form={sharedForm} />
    </div>

    <ChartFilterFields form={sharedForm} />

    {#if $message}
        <p class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{$message}</p>
    {/if}

    <div class="flex flex-col gap-2 sm:flex-row">
        <Button type="submit" fullWidth>Save changes</Button>
        <button
            type="button"
            class="inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-dark-600 dark:bg-dark-800 dark:text-slate-200 dark:hover:bg-dark-700"
            onclick={onCancel}
        >
            Cancel
        </button>
    </div>
</form>
