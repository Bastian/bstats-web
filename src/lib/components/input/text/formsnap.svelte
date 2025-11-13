<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
    import type { FormPath } from 'sveltekit-superforms';
    import Input from '$lib/components/input/text/input.svelte';
    import Root from '$lib/components/input/text/root.svelte';
    import { Control, Description, Field, FieldErrors, Label, type FieldProps } from 'formsnap';
    import type { HTMLInputAttributes } from 'svelte/elements';

    interface Props {
        form: FieldProps<T, U>['form'];
        name: FieldProps<T, U>['name'];
        value: HTMLInputAttributes['value'];
        label: string;
        description?: string;
        inputProps?: HTMLInputAttributes;
    }

    let { form, name, value = $bindable(), label, description, inputProps }: Props = $props();
</script>

<div class="space-y-1.5">
    <Field {form} {name}>
        <Root>
            <Control>
                {#snippet children({ props })}
                    <Label>{label}</Label>
                    <Input {...props} bind:value {...inputProps} />
                {/snippet}
            </Control>
        </Root>
        <FieldErrors class="text-xs font-semibold text-rose-600" />
        {#if description}
            <Description class="text-xs text-gray-500">{description}</Description>
        {/if}
    </Field>
</div>
