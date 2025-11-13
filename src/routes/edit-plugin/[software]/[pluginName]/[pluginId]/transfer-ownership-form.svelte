<script lang="ts">
    import Button from '$lib/components/button.svelte';
    import { TextInput } from '$lib/components/input/text';
    import { superForm } from 'sveltekit-superforms';
    import { zod4Client } from 'sveltekit-superforms/adapters';
    import type { PageData } from './$types';
    import { transferOwnershipSchema } from './transfer-ownership-schema';

    let { schema }: { schema: PageData['transferOwnershipSchema'] } = $props();

    const form = superForm(schema, {
        validators: zod4Client(transferOwnershipSchema)
    });

    const { form: formData, enhance } = form;
</script>

<form class="space-y-5" method="POST" action="?/transferOwnership" use:enhance>
    <TextInput.Formsnap
        {form}
        name="ownerName"
        label="Owner Name"
        description="The new owner's username."
        inputProps={{ placeholder: 'Bastian' }}
        bind:value={$formData.ownerName}
    />

    <Button type="submit" fullWidth>Transfer ownership</Button>
</form>
