<script lang="ts" module>
    import imgSpigot from '$lib/assets/images/logos/spigot.png';
    import imgBungeeCord from '$lib/assets/images/logos/bungeecord.png';
    import imgSponge from '$lib/assets/images/logos/spongie-mark.svg';
    import imgVelocity from '$lib/assets/images/logos/velocity.png';

    export type Platform =
        | 'bukkit'
        | 'bungeecord'
        | 'sponge'
        | 'velocity'
        | 'server-implementation';

    export const platformOptions = [
        {
            id: 'bukkit',
            label: 'Bukkit / Spigot / Paper',
            iconUrl: imgSpigot
        },
        {
            id: 'bungeecord',
            label: 'BungeeCord',
            iconUrl: imgBungeeCord
        },
        {
            id: 'sponge',
            label: 'Sponge',
            iconUrl: imgSponge
        },
        {
            id: 'velocity',
            label: 'Velocity',
            iconUrl: imgVelocity
        },
        {
            id: 'server-implementation',
            label: 'Server implementation',
            icon: IconTerminal2,
            description:
                'Select when not a plugin but a server implementation (e.g., a fork of Paper or other similar projects).'
        }
    ] as const;
</script>

<script lang="ts">
    import OptionCard from './option-card.svelte';

    import WizardStep from './wizard-step.svelte';
    import IconTerminal2 from '@tabler/icons-svelte/icons/terminal-2';

    let {
        selectedPlatform = $bindable(),
        editable
    }: {
        selectedPlatform?: Platform | null;
        editable: boolean;
    } = $props();
</script>

<WizardStep index={1} title="Choose your platform" status={selectedPlatform ? 'done' : 'active'}>
    <p>Pick the platform your plugin runs on.</p>
    <div class="mt-4 grid gap-4 md:grid-cols-2">
        {#each platformOptions as option (option.id)}
            <OptionCard
                label={option.label}
                active={selectedPlatform === option.id}
                onclick={() => (selectedPlatform = option.id)}
                disabled={!editable}
                {...'description' in option ? { description: option.description } : {}}
            >
                {#snippet icon()}
                    {#if 'iconUrl' in option}
                        <img src={option.iconUrl} alt="" class="object-contain" />
                    {:else}
                        <option.icon />
                    {/if}
                {/snippet}
            </OptionCard>
        {/each}
    </div>
</WizardStep>
