<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    interface Props extends HTMLAttributes<HTMLDivElement> {
        children: Snippet;
        tableClass?: string;
    }

    let { children, tableClass, class: className, ...restProps }: Props = $props();
</script>

<div
    class={[
        'overflow-hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm',
        className
    ]}
    {...restProps}
>
    <table class={['min-w-full divide-y divide-slate-200 text-sm', tableClass]}>
        {@render children()}
    </table>
</div>
