<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
    import Input from '$lib/components/input/checkbox/Input.svelte';
    import Root from '$lib/components/input/checkbox/Root.svelte';
    import { Control, Description, Field, FieldErrors, Label, type FieldProps } from 'formsnap';
    import type { HTMLInputAttributes } from 'svelte/elements';
    import type { FormPath } from 'sveltekit-superforms';

    interface Props {
        form: FieldProps<T, U>['form'];
        name: FieldProps<T, U>['name'];
        checked: boolean;
        label: string;
        description?: string;
        inputProps?: HTMLInputAttributes;
    }

    let { form, name, checked = $bindable(), label, description, inputProps }: Props = $props();
</script>

<div class="space-y-1.5">
    <Field {form} {name}>
        <Root>
            <Control>
                {#snippet children({ props })}
                    <!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
                    <Input {...props} bind:checked {...inputProps as any} />
                    <Label>{label}</Label>
                {/snippet}
            </Control>
        </Root>
        <FieldErrors class="text-xs font-semibold text-rose-600" />
        {#if description}
            <Description class="text-xs text-gray-500">{description}</Description>
        {/if}
    </Field>
</div>
