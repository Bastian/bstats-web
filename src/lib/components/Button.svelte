<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export interface Props {
		href?: string;
		children: Snippet;
		variant?: 'primary';
		size?: 'small' | 'medium' | 'large';
		fullWidth?: boolean;
		disabled?: boolean;
		buttonProps?: HTMLButtonAttributes;
	}

	let { href, children, size, fullWidth, disabled, variant, buttonProps }: Props = $props();
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	{href}
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
	disabled={disabled ? true : undefined}
	{...href ? {} : buttonProps}
>
	{@render children()}
</svelte:element>
