<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';
	import type { Button } from 'bits-ui';
	import type { Snippet } from 'svelte';

	type Props = Button.RootProps & {
		children: Snippet;
		variant?: 'primary';
		size?: 'small' | 'medium' | 'large';
		fullWidth?: boolean;
	};

	let { children, size, fullWidth, variant, ...restProps }: Props = $props();
</script>

<ButtonPrimitive.Root
	class={[
		'cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
		{
			'inline-flex items-center gap-2 rounded-full bg-brand-600 font-semibold text-white shadow-md transition-transform duration-200 hover:not-disabled:bg-brand-700 hover:not-disabled:shadow-lg focus-visible:ring-2 focus-visible:ring-brand-500/70 focus-visible:ring-offset-2 focus-visible:outline-none':
				variant === 'primary' || !variant,
			'px-6 py-3 text-base': size === 'large',
			'px-5 py-2 text-sm': size === 'medium' || !size,
			'px-4 py-2 text-sm': size === 'small',
			'w-full justify-center': !!fullWidth
		}
	]}
	{...restProps}
>
	{@render children()}
</ButtonPrimitive.Root>
