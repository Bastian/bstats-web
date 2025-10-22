<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		type?: 'default' | 'error' | 'none';
		children: Snippet;
		class?: string;
	}

	let { type = 'default', children, class: className }: Props = $props();
</script>

<span
	class={[
		'inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium',
		{ 'bg-brand-100 text-brand-700': type === 'default' },
		{ 'bg-red-100 text-red-700': type === 'error' },
		className
	]}
>
	{@render children()}
</span>
