<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		badge: Snippet;
		title: Snippet;
		content: Snippet;
		extra?: Snippet;
	}

	let { badge, title, content, extra }: Props = $props();
</script>

<section
	class={[
		'relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-brand-50 via-white to-sky-100'
	]}
>
	<div class={['mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20']}>
		<div class="max-w-3xl space-y-4">
			{@render badge()}
			<h1 class="font-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
				{@render title()}
			</h1>
			<p class="text-base leading-relaxed text-slate-600">
				{@render content()}
			</p>
			{#if extra}
				{@render extra()}
			{/if}
		</div>
	</div>
</section>
