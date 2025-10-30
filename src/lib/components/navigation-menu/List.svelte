<script lang="ts">
	import { NavigationMenu as BitsNavigationMenu } from 'bits-ui';
	import type { Snippet } from 'svelte';

	type Props = BitsNavigationMenu.ListProps & {
		children: Snippet;
		class?: string;
	};

	let { children, class: className, ...restProps }: Props = $props();
</script>

<BitsNavigationMenu.List
	class={['flex items-center gap-4 text-sm font-semibold text-slate-600 lg:gap-6', className]}
	{...restProps}
>
	{@render children()}
</BitsNavigationMenu.List>
