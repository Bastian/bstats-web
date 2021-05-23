<script lang="ts">
    import Button from "$components/forms/Button.svelte";
    import LinkButton from "$components/forms/LinkButton.svelte";
    import TextField from "$components/forms/TextField.svelte";
    import Step from "$components/Step.svelte";
    import type { Service } from "$defs/service.interface";
    import { createEventDispatcher } from "svelte";

    export let step: number;

    const dispatch =
        createEventDispatcher<{
            skip: undefined;
            addedService: Service;
        }>();

    function handleAddClick() {
        added = true;
        // TODO Actually create service
        dispatch("addedService", {
            id: 123,
            name: serviceName,
            isGlobal: false,
            owner: { name: "" },
            software: { id: 1 },
        });
    }

    export let serviceName = "";
    export let added = false;
</script>

<Step {step} title="Name your service">
    <span slot="description">
        Please enter the name of your service and then press the button. This
        will register the service on bStats and add it to your account. If you
        already registered the service on bStats in the past, you can skip this
        step.
    </span>

    {#if added}
        <div class="block mt-4 ml-2 text-gray-600 dark:text-gray-300">
            <span class="font-bold text-gray-700 dark:text-gray-200">
                {serviceName}
            </span>? Good choice! :-)
        </div>
    {:else}
        <TextField
            id="service-name"
            label="Service Name"
            class="max-w-xs mt-2"
            hideLabel
            placeholder="My fancy plugin"
            disabled={added}
            bind:value={serviceName}
        />
        <Button
            small
            disabled={added || serviceName.trim().length <= 0}
            class="mt-2"
            on:click={handleAddClick}
        >
            Add and continue
        </Button>
        <LinkButton
            small
            disabled={added}
            class="mt-2"
            on:click={() => dispatch("skip")}
        >
            Skip this step
        </LinkButton>
    {/if}
</Step>
