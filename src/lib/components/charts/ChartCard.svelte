<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		chartId: string;
		colSpan?: 'single' | 'double';
		children: Snippet;
	}

	let { title, chartId, colSpan = 'single', children }: Props = $props();

	const colClass = colSpan === 'double' ? 'col-span-1 min-w-0 md:col-span-2' : 'col-span-1 min-w-0';
</script>

<article id={chartId} class="{colClass} rounded-2xl border border-slate-200 bg-white shadow-sm">
	<div class="flex items-start justify-between gap-4 px-5 pt-5">
		<div class="flex flex-col gap-2">
			<h3 class="font-display text-lg font-semibold text-slate-900">
				{title}
			</h3>
		</div>
		<a
			href="#{chartId}"
			class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-600"
		>
			<span>Permalink</span>
			<svg
				class="h-4 w-4 text-current"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M13 4h7v7M11 13l9-9M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</a>
	</div>
	<div class="px-5 pb-6 pt-4">
		<div class="min-w-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-2 sm:p-3">
			{@render children()}
		</div>
	</div>
</article>
