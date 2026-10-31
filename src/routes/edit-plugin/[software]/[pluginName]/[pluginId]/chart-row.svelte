<script lang="ts" module>
    import IconChartBar from '@tabler/icons-svelte/icons/chart-bar';
    import IconChartDonut from '@tabler/icons-svelte/icons/chart-donut';
    import IconChartHistogram from '@tabler/icons-svelte/icons/chart-histogram';
    import IconChartLine from '@tabler/icons-svelte/icons/chart-line';
    import IconChartPie from '@tabler/icons-svelte/icons/chart-pie';
    import IconChartPie2 from '@tabler/icons-svelte/icons/chart-pie-2';
    import IconWorld from '@tabler/icons-svelte/icons/world';

    export interface ChartRowItem {
        /** svelte-dnd-action requires an `id`; it is the chart id. */
        id: string;
        title: string;
        type: string;
        isDefault: boolean;
        hidden: boolean;
    }

    const CHART_TYPES: Record<string, { label: string; icon: typeof IconChartLine }> = {
        single_linechart: { label: 'Line chart', icon: IconChartLine },
        simple_pie: { label: 'Simple pie', icon: IconChartPie },
        advanced_pie: { label: 'Advanced pie', icon: IconChartPie2 },
        drilldown_pie: { label: 'Drilldown pie', icon: IconChartDonut },
        simple_bar: { label: 'Simple bar', icon: IconChartBar },
        advanced_bar: { label: 'Advanced bar', icon: IconChartHistogram },
        simple_map: { label: 'Map', icon: IconWorld },
        advanced_map: { label: 'Map', icon: IconWorld }
    };

    // Disabled due to recurring border-dispute complaints.
    const DISABLED_CHART_TYPES = new Set(['simple_map', 'advanced_map']);
</script>

<script lang="ts">
    import IconCheck from '@tabler/icons-svelte/icons/check';
    import IconExternalLink from '@tabler/icons-svelte/icons/external-link';
    import IconEye from '@tabler/icons-svelte/icons/eye';
    import IconEyeOff from '@tabler/icons-svelte/icons/eye-off';
    import IconGripVertical from '@tabler/icons-svelte/icons/grip-vertical';
    import IconLoader2 from '@tabler/icons-svelte/icons/loader-2';
    import IconLock from '@tabler/icons-svelte/icons/lock';
    import IconPencil from '@tabler/icons-svelte/icons/pencil';
    import IconTrash from '@tabler/icons-svelte/icons/trash';
    import IconX from '@tabler/icons-svelte/icons/x';
    import { tick } from 'svelte';
    import { resolve } from '$app/paths';
    import { dragHandle } from 'svelte-dnd-action';
    import { chartIdSchema, chartTitleSchema } from './add-chart-schema';

    interface Props {
        chart: ChartRowItem;
        /** Path of the public plugin page, e.g. /plugin/bukkit/Name/1 */
        pluginPath: `/plugin/${string}`;
        /** Resolves to an error message, or null on success. */
        onRename: (title: string) => Promise<string | null>;
        /** Custom charts only. Resolves to an error message, or null on success. */
        onChangeId: (id: string) => Promise<string | null>;
        onToggleHidden: () => void;
        onDelete: () => Promise<void>;
        /** Briefly emphasised after the user jumps to this chart via search. */
        highlighted?: boolean;
    }

    let {
        chart,
        pluginPath,
        onRename,
        onChangeId,
        onToggleHidden,
        onDelete,
        highlighted = false
    }: Props = $props();

    const typeInfo = $derived(CHART_TYPES[chart.type] ?? { label: chart.type, icon: IconChartBar });
    const disabled = $derived(DISABLED_CHART_TYPES.has(chart.type));
    // Title split before its last word, see the touch-screen pencil in the markup.
    const titleHead = $derived(chart.title.slice(0, chart.title.lastIndexOf(' ') + 1));
    const titleTail = $derived(chart.title.slice(chart.title.lastIndexOf(' ') + 1));

    // The ID is what the plugin's Metrics code sends, so only custom charts may change it.
    const fields = {
        title: {
            schema: chartTitleSchema,
            current: () => chart.title,
            save: (value: string) => onRename(value)
        },
        id: {
            schema: chartIdSchema,
            current: () => chart.id,
            save: (value: string) => onChangeId(value)
        }
    };

    let editingField = $state<keyof typeof fields | null>(null);
    const editing = $derived(editingField !== null);
    let draft = $state('');
    let editError = $state<string | null>(null);
    let saving = $state(false);
    let confirmingDelete = $state(false);
    let deleting = $state(false);
    let input = $state<HTMLInputElement>();

    async function startEditing(field: keyof typeof fields) {
        draft = fields[field].current();
        editError = null;
        confirmingDelete = false;
        editingField = field;
        await tick();
        input?.select();
    }

    function cancelEditing() {
        editingField = null;
        editError = null;
    }

    async function save() {
        // Escape closes the editor first; removing the input then fires focusout,
        // which must not save the discarded draft.
        if (!editingField || saving) return;
        const field = fields[editingField];
        const parsed = field.schema.safeParse(draft);
        if (!parsed.success) {
            editError = parsed.error.issues[0].message;
            return;
        }
        if (parsed.data === field.current()) {
            cancelEditing();
            return;
        }
        saving = true;
        editError = await field.save(parsed.data);
        saving = false;
        if (editError) {
            input?.focus();
        } else {
            editingField = null;
        }
    }

    async function confirmDelete() {
        deleting = true;
        await onDelete();
        deleting = false;
        confirmingDelete = false;
    }

    const ID_CHANGE_HINT = 'Plugin must send the new ID';

    const inputOk =
        'border-brand-400 focus:border-brand-500 focus:ring-brand-500/30 dark:border-brand-700';
    const inputError = 'border-red-400 focus:border-red-500 focus:ring-red-500/30';

    // Small round separator between the ID, chart type and origin.
    const metaDot = 'size-[3px] shrink-0 rounded-full bg-slate-300 dark:bg-dark-400';

    // Fixed 16px height, the same as the ID line, so hiding a chart never changes the row height.
    const metaPill =
        'inline-flex h-4 items-center rounded-full bg-slate-200/80 px-1.5 text-[11px] leading-none font-medium text-slate-600 dark:bg-dark-600 dark:text-slate-300';

    // Size kept separate: two size utilities on one element don't reliably override each other.
    const iconButtonBase =
        'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-brand-500/70 focus-visible:outline-none dark:text-slate-500 dark:hover:bg-dark-700 dark:hover:text-slate-200';
    const iconButton = `${iconButtonBase} size-8`;
</script>

<!-- While renaming, the whole row is the form, so Save/Cancel can sit in the
     same icon column as the row actions and nothing shifts. -->
<svelte:element
    this={editing ? 'form' : 'div'}
    onsubmit={(e: SubmitEvent) => {
        e.preventDefault();
        save();
    }}
    onfocusout={(e: FocusEvent) => {
        // Only the form counts: switching from <div> to <form> removes the
        // focused pencil button, and that focusout must not save immediately.
        const row = e.currentTarget;
        if (!(row instanceof HTMLFormElement)) return;
        if (!row.contains(e.relatedTarget as Node | null)) save();
    }}
    class={[
        'group flex items-center gap-2 rounded-xl border py-2 pr-2 pl-1 transition-[background-color,border-color,box-shadow] duration-500 motion-reduce:transition-none sm:gap-3 sm:pr-3',
        highlighted &&
            'ring-2 ring-brand-500 ring-offset-2 ring-offset-white dark:ring-brand-400 dark:ring-offset-dark-800',
        confirmingDelete
            ? 'border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/30'
            : highlighted
              ? 'border-brand-300 bg-brand-50 dark:border-brand-800 dark:bg-brand-950/40'
              : chart.hidden
                ? 'border-dashed border-slate-300 bg-slate-50 dark:border-dark-500 dark:bg-dark-900/60'
                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-dark-700 dark:bg-dark-800 dark:hover:border-dark-600'
    ]}
>
    <span
        use:dragHandle
        aria-label="Drag to reorder {chart.title}"
        class="flex h-9 w-6 shrink-0 cursor-grab items-center justify-center rounded-md text-slate-300 hover:text-slate-500 focus-visible:ring-2 focus-visible:ring-brand-500/70 focus-visible:outline-none active:cursor-grabbing dark:text-dark-400 dark:hover:text-slate-400"
    >
        <IconGripVertical size={18} />
    </span>

    <span
        title={typeInfo.label}
        class={[
            'hidden size-9 shrink-0 items-center justify-center rounded-lg sm:flex',
            chart.hidden
                ? 'bg-slate-100 text-slate-400 dark:bg-dark-800 dark:text-dark-300'
                : 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300'
        ]}
    >
        <typeInfo.icon size={20} stroke={1.75} />
        <span class="sr-only">{typeInfo.label}</span>
    </span>

    {#snippet editButtons(size: 'title' | 'id')}
        <!-- Same height as the input next to it, so they share a centre line. -->
        {@const sizeClass = size === 'title' ? 'size-8' : '-my-1 size-6'}
        {@const iconSize = size === 'title' ? 18 : 15}
        <button
            type="submit"
            class="{iconButtonBase} {sizeClass}"
            aria-label={size === 'id' ? 'Save ID' : 'Save name'}
            title="Save (Enter)"
        >
            {#if saving}
                <IconLoader2 size={iconSize} class="animate-spin" />
            {:else}
                <IconCheck size={iconSize} class="text-brand-600 dark:text-brand-400" />
            {/if}
        </button>
        <button
            type="button"
            class="{iconButtonBase} {sizeClass}"
            onclick={cancelEditing}
            aria-label="Cancel editing"
            title="Cancel (Esc)"
        >
            <IconX size={iconSize} />
        </button>
    {/snippet}

    <div class="min-w-0 flex-1">
        {#if editingField === 'title'}
            <!-- Same height (32px, set by the pencil button) and text position as
                 the title it replaces; -ml-2 plus the padding offsets the border. -->
            <div class="-ml-2 flex items-center gap-1">
                <input
                    bind:this={input}
                    bind:value={draft}
                    onkeydown={(e) => e.key === 'Escape' && cancelEditing()}
                    maxlength={50}
                    aria-label="Chart name"
                    aria-invalid={editError ? 'true' : undefined}
                    aria-describedby={editError ? `edit-error-${chart.id}` : undefined}
                    disabled={saving}
                    class={[
                        'h-8 min-w-0 flex-1 rounded-md border bg-white px-[7px] font-semibold text-slate-900 focus:ring-2 focus:outline-none dark:bg-dark-900 dark:text-slate-100',
                        editError ? inputError : inputOk
                    ]}
                />
                {@render editButtons('title')}
            </div>
        {:else}
            <div
                class="group/title flex min-w-0 flex-wrap items-center gap-x-1 gap-y-0.5 sm:flex-nowrap"
            >
                <button
                    type="button"
                    onclick={() => startEditing('title')}
                    data-chart-title
                    title="Click to rename"
                    class={[
                        '-mx-1 max-w-full cursor-text rounded-md px-1 text-left font-semibold break-words decoration-slate-300 decoration-dashed underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-brand-500/70 focus-visible:outline-none sm:min-w-0 sm:truncate dark:decoration-dark-400',
                        chart.hidden
                            ? 'text-slate-500 dark:text-slate-400'
                            : 'text-slate-900 dark:text-slate-100'
                    ]}
                >
                    <!-- The last word and the touch-screen pencil never break apart,
                         so the pencil can't end up alone on a line. -->
                    {titleHead}<span class="whitespace-nowrap"
                        >{titleTail}<IconPencil
                            size={14}
                            aria-hidden="true"
                            class="ml-1.5 inline align-[-2px] text-slate-400 sm:hidden dark:text-slate-500"
                        /></span
                    >
                </button>
                <!-- Status pills sit with the title: they describe the chart as a
                     whole, and keep the ID line short enough not to truncate. -->
                {#if chart.hidden}
                    <span class="{metaPill} ml-1 shrink-0">Hidden</span>
                {/if}
                {#if disabled}
                    <span
                        class="{metaPill} ml-1 shrink-0"
                        title="Map charts are currently turned off on bStats">Disabled</span
                    >
                {/if}
                <!-- From sm up: hover pencil with a mouse, always shown on touch. On phones it sits inside the title
                     text instead (above), so it wraps with the last word. -->
                <span class="hidden sm:contents">
                    <button
                        type="button"
                        onclick={() => startEditing('title')}
                        class="{iconButton} pointer-fine:opacity-0 pointer-fine:group-focus-within/title:opacity-100 pointer-fine:group-hover/title:opacity-100"
                        aria-label="Rename {chart.title}"
                        title="Rename"
                    >
                        <IconPencil size={15} />
                    </button>
                </span>
            </div>
        {/if}

        {#if editingField === 'title' && editError}
            <!-- Takes the meta line's place so the row height doesn't change. -->
            <p id="edit-error-{chart.id}" class="mt-0.5 text-xs text-red-600 dark:text-red-400">
                {editError}
            </p>
        {:else if editingField === 'id'}
            <!-- 24px input with -4px margins: the line stays 16px tall. The hint
                 (or error) sits beside it instead of adding a line. -->
            <div class="mt-0.5 flex min-w-0 items-center gap-2 text-xs">
                <input
                    bind:this={input}
                    bind:value={draft}
                    onkeydown={(e) => e.key === 'Escape' && cancelEditing()}
                    maxlength={50}
                    aria-label="New ID for {chart.title}"
                    aria-invalid={editError ? 'true' : undefined}
                    aria-describedby="edit-hint-{chart.id}"
                    disabled={saving}
                    spellcheck="false"
                    autocomplete="off"
                    class={[
                        '-my-1 -ml-[5px] h-6 w-32 shrink-0 rounded-md border bg-white px-1 font-mono text-xs text-slate-900 focus:ring-2 focus:outline-none dark:bg-dark-900 dark:text-slate-100',
                        editError ? inputError : inputOk
                    ]}
                />
                <span class="-ml-1 flex shrink-0 items-center">
                    {@render editButtons('id')}
                </span>
                <p
                    id="edit-hint-{chart.id}"
                    class={[
                        'min-w-0 truncate',
                        editError
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-amber-700 dark:text-amber-400'
                    ]}
                    title={editError ?? ID_CHANGE_HINT}
                >
                    {editError ?? ID_CHANGE_HINT}
                </p>
            </div>
        {:else}
            <div
                class="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs whitespace-nowrap text-slate-500 sm:flex-nowrap dark:text-slate-400"
            >
                <!-- From sm up: one line that never wraps, so row height stays fixed;
                     the ID keeps its size and the descriptive text truncates. On
                     phones the ID gets its own line and type/origin sit below. -->
                {#if chart.isDefault}
                    <span
                        class="inline-flex shrink-0 basis-full items-center gap-1 sm:basis-auto"
                        title="Default chart IDs can't be changed"
                    >
                        <IconLock size={12} aria-hidden="true" />
                        <code class="font-mono">{chart.id}</code>
                    </span>
                {:else}
                    <!-- With a mouse the pencil takes no space until the ID is
                         hovered or focused, so the spacing before the first dot
                         matches default charts. Touch screens always show it. -->
                    <span
                        class="group/id inline-flex shrink-0 basis-full items-center gap-0.5 sm:basis-auto"
                    >
                        <button
                            type="button"
                            onclick={() => startEditing('id')}
                            title="Click to change the ID your plugin sends"
                            class="-mx-1 cursor-text rounded px-1 font-mono decoration-slate-300 decoration-dashed underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-brand-500/70 focus-visible:outline-none dark:decoration-dark-400"
                        >
                            {chart.id}
                        </button>
                        <button
                            type="button"
                            onclick={() => startEditing('id')}
                            class="inline-flex size-4 cursor-pointer items-center justify-center rounded text-slate-400 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-brand-500/70 focus-visible:outline-none dark:text-slate-500 dark:hover:text-slate-200 pointer-fine:hidden pointer-fine:group-focus-within/id:inline-flex pointer-fine:group-hover/id:inline-flex"
                            aria-label="Change ID of {chart.title}"
                            title="Change ID"
                        >
                            <IconPencil size={12} />
                        </button>
                    </span>
                {/if}
                <span class="{metaDot} hidden sm:block" aria-hidden="true"></span>
                <!-- Kept together so the line never breaks between type and origin.
                     Phones show the type only: the lock (default) or ID pencil
                     (custom) already tells the two apart there. -->
                <span class="flex min-w-0 items-center gap-x-1.5">
                    <span class="min-w-0 truncate">{typeInfo.label}</span>
                    <span class="{metaDot} hidden sm:block" aria-hidden="true"></span>
                    <span class="hidden min-w-0 truncate sm:block">
                        {chart.isDefault ? 'Default chart' : 'Custom chart'}
                    </span>
                </span>
            </div>
        {/if}
    </div>

    {#if confirmingDelete}
        <div class="flex shrink-0 items-center gap-2">
            <span class="hidden text-sm text-red-700 md:inline dark:text-red-300">
                Delete with all its data?
            </span>
            <button
                type="button"
                onclick={confirmDelete}
                disabled={deleting}
                class="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg bg-red-600 px-3 text-sm font-semibold text-white hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500/70 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-60"
            >
                {#if deleting}<IconLoader2 size={16} class="animate-spin" />{/if}
                Delete
            </button>
            <button
                type="button"
                onclick={() => (confirmingDelete = false)}
                class="h-8 cursor-pointer rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-white focus-visible:ring-2 focus-visible:ring-brand-500/70 focus-visible:outline-none dark:text-slate-300 dark:hover:bg-dark-800"
            >
                Cancel
            </button>
        </div>
    {:else}
        <!-- Invisible (not removed) while editing: hidden from view, focus and
             screen readers, but still taking its space so the input doesn't widen. -->
        <div class={['flex shrink-0 items-center', editing && 'invisible']}>
            {#if !chart.hidden}
                <a
                    href={resolve(`${pluginPath}#${chart.id}`)}
                    class={iconButton}
                    aria-label="View {chart.title} on the public page"
                    title="View on public page"
                >
                    <IconExternalLink size={18} />
                </a>
            {:else}
                <!-- Hidden charts have no public anchor. Keeps columns aligned. -->
                <span class="size-8" aria-hidden="true"></span>
            {/if}
            <button
                type="button"
                onclick={onToggleHidden}
                class={[iconButton, chart.hidden && 'text-slate-600 dark:text-slate-300']}
                aria-label={chart.hidden
                    ? `Show ${chart.title} on the public page`
                    : `Hide ${chart.title} from the public page`}
                title={chart.hidden ? 'Show on public page' : 'Hide from public page'}
            >
                {#if chart.hidden}
                    <IconEyeOff size={18} />
                {:else}
                    <IconEye size={18} />
                {/if}
            </button>
            {#if chart.isDefault}
                <!-- Default charts can be hidden but never deleted. Keeps columns aligned. -->
                <span class="size-8" aria-hidden="true"></span>
            {:else}
                <button
                    type="button"
                    onclick={() => (confirmingDelete = true)}
                    class="{iconButton} hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                    aria-label="Delete {chart.title}"
                    title="Delete chart"
                >
                    <IconTrash size={18} />
                </button>
            {/if}
        </div>
    {/if}
</svelte:element>
