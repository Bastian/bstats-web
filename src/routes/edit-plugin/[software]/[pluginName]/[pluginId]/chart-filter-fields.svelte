<script lang="ts">
    import { Checkbox } from '$lib/components/input/checkbox';
    import { TextInput } from '$lib/components/input/text';
    import { Control, Description, ElementField, Field, FieldErrors, Label } from 'formsnap';
    import type { SuperForm } from 'sveltekit-superforms';
    import type { ChartFormData } from './add-chart-schema';

    // Filter settings shared by the add and edit forms; bar charts have no filters.
    let { form }: { form: SuperForm<ChartFormData> } = $props();

    const { form: formData } = form;
</script>

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
