<script lang="ts">
	import { Accordion as BitsAccordion } from 'bits-ui';
	import type { Snippet } from 'svelte';

	type Props = BitsAccordion.RootProps & {
		children: Snippet;
	};

	let { children, type = 'single', value = $bindable(), ...restProps }: Props = $props();
</script>

<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
<BitsAccordion.Root {type} bind:value {...restProps as any}>
	{@render children()}
</BitsAccordion.Root>
