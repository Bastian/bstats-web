<script lang="ts">
    import Button from '$lib/components/Button.svelte';
    import { TextInput } from '$lib/components/input/text';
    import { superForm } from 'sveltekit-superforms';
    import { zod4Client } from 'sveltekit-superforms/adapters';
    import type { PageData } from './$types';
    import { deletePluginSchema } from './delete-plugin-schema';

    let { schema, plugin }: { schema: PageData['deletePluginSchema']; plugin: PageData['plugin'] } =
        $props();

    const form = superForm(schema, {
        validators: zod4Client(deletePluginSchema(plugin.name))
    });

    const { form: formData, enhance } = form;
</script>

<form class="space-y-5" method="POST" action="?/deletePlugin" use:enhance>
    <TextInput.Formsnap
        {form}
        name="pluginName"
        label="Plugin Name"
        description="Confirm deletion by entering the plugin name."
        inputProps={{ placeholder: plugin.name }}
        bind:value={$formData.pluginName}
    />

    <Button type="submit" fullWidth>Delete Plugin</Button>
</form>
