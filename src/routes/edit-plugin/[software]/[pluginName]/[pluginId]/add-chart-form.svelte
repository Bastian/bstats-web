<script lang="ts">
    import { TextInput } from '$lib/components/input/text';
    import { Control, Field, FieldErrors, Label } from 'formsnap';
    import { superForm } from 'sveltekit-superforms';
    import { zod4Client } from 'sveltekit-superforms/adapters';
    import type { PageData } from './$types';
    import { addChartSchema } from './add-chart-schema';
    import Button from '$lib/components/button.svelte';
    import BarChartFields from './bar-chart-fields.svelte';
    import ChartFilterFields from './chart-filter-fields.svelte';

    let { schema }: { schema: PageData['addChartSchema'] } = $props();

    const form = superForm(schema, {
        // 'json' so complex fields (e.g. the reorderable barLabels array, which
        // isn't backed by named inputs) are submitted from $formData directly.
        dataType: 'json',
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

        <BarChartFields {form} />
    </div>

    <ChartFilterFields {form} />

    <Button type="submit" fullWidth>Save chart</Button>
</form>
