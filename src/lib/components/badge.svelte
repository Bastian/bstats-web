<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        type?: 'default' | 'error' | 'gray' | 'none';
        size?: 'small' | 'medium' | 'large';
        children: Snippet;
        class?: string;
    }

    let { type = 'default', size = 'medium', children, class: className }: Props = $props();
</script>

<span
    class={[
        'inline-flex items-center gap-2 rounded-full',
        {
            'px-2 py-0.5 text-xs font-medium': size === 'small',
            'px-3 py-1 text-sm font-medium': size === 'medium',
            'px-4 py-2 text-base font-semibold': size === 'large',
            'bg-brand-100 text-brand-700': type === 'default',
            'bg-red-100 text-red-700': type === 'error',
            'bg-slate-100 text-slate-700': type === 'gray'
        },
        className
    ]}
>
    {@render children()}
</span>
