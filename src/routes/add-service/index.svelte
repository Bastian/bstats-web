<script context="module" lang="ts">
    import Card from "$components/Card.svelte";
    import TextField from "$components/forms/TextField.svelte";
    import PencilIcon from "$components/hero-icons/PencilIcon.svelte";
    import StandardNavigation from "$components/navigation/StandardNavigation.svelte";
    import type { Load } from "@sveltejs/kit";
    import { createForm } from "svelte-forms-lib";
    import * as yup from "yup";

    export const load: Load = async ({ session, page }) => {
        // This page requires the user to be logged in
        if (!session.user) {
            return {
                status: 307,
                redirect: `/login?redirect=${encodeURIComponent(page.path)}`,
            };
        }
        return {};
    };
</script>

<script lang="ts">
    import Button from "$components/forms/Button.svelte";
    import Select from "$components/forms/Select.svelte";
    import TerminalIcon from "$components/hero-icons/TerminalIcon.svelte";
    import { session } from "$app/stores";
    import type { Software } from "$defs/software/software.interface";

    let platforms: { label: string; value: any }[] = [];
    $: platforms = ($session.softwareList as Software[]).map((software) => ({
        label: software.name,
        value: software.id,
    }));

    const { form, errors, handleChange, handleSubmit } = createForm({
        initialValues: {
            serviceName: "",
            platform: platforms[0]?.value,
        },
        validationSchema: yup.object().shape({
            serviceName: yup.string().required("Please enter a name"),
        }),
        onSubmit: async (values) => {
            console.log(values);
            // TODO
        },
    });
</script>

<svelte:head>
    <title>Add Service</title>
</svelte:head>

<StandardNavigation />

<div
    class="flex flex-grow justify-center items-center bg-gray-100 dark:bg-gray-900"
>
    <Card title="Add Service" class="my-12 sm:my-24 mx-4 sm:mx-8">
        <form on:submit={handleSubmit}>
            <TextField
                bind:value={$form.serviceName}
                on:change={handleChange}
                id="service-name"
                name="serviceName"
                label="Service Name"
                error={$errors.serviceName}
            >
                <PencilIcon slot="icon" />
            </TextField>

            <Select
                bind:value={$form.platform}
                options={platforms}
                on:change={handleChange}
                id="platform"
                name="platform"
                label="Platform"
                class="mt-4"
                error={$errors.platform}
                helpText="The platform that your service runs on"
            >
                <TerminalIcon slot="icon" />
            </Select>

            <Button class="mt-4 w-full" type="submit">Add Service</Button>
        </form>
    </Card>
</div>
