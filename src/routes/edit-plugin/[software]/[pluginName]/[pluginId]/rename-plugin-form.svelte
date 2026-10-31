<script lang="ts">
    import Button from '$lib/components/button.svelte';
    import { TextInput } from '$lib/components/input/text';
    import { superForm } from 'sveltekit-superforms';
    import { zod4Client } from 'sveltekit-superforms/adapters';
    import type { PageData } from './$types';
    import { updatePluginNameSchema } from './update-plugin-name-schema';

    let {
        schema,
        currentName
    }: { schema: PageData['updatePluginNameSchema']; currentName: string } = $props();

    const form = superForm(
        { ...schema, data: { ...schema.data, name: currentName } },
        {
            validators: zod4Client(updatePluginNameSchema)
        }
    );

    const { form: formData, enhance, message } = form;
</script>

<form class="space-y-5" method="POST" action="?/updatePluginName" use:enhance>
    <TextInput.Formsnap
        {form}
        name="name"
        label="Plugin name"
        description="The name shown on bStats and in the public URL. Must be unique for this platform."
        inputProps={{ placeholder: currentName, maxlength: 48 }}
        bind:value={$formData.name}
    />

    <p
        class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
    >
        Plugins with a Metrics class older than 1.7 (2020) send the old name, so their data will no
        longer be recorded.
    </p>

    {#if $message}
        <p class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{$message}</p>
    {/if}

    <Button type="submit" fullWidth>Rename plugin</Button>
</form>
