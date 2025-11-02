<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLTableSectionElement> {
		children: Snippet;
	}

	let { children, class: className, ...restProps }: Props = $props();
</script>

<thead class={['bg-slate-100 text-slate-500', className]} {...restProps}>
	{@render children()}
</thead>
