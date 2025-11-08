<script lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';

    type Props = HTMLInputAttributes;

    let { class: className, value = $bindable(), ...restProps }: Props = $props();
</script>

<input
    type="text"
    class={[
        'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-brand-300 focus:ring-2 focus:ring-brand-200 focus:outline-none',
        'aria-[invalid=true]:border-rose-300 aria-[invalid=true]:focus-visible:ring-rose-200',
        className
    ]}
    bind:value
    {...restProps}
/>
