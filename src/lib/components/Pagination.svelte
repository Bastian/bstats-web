<script lang="ts">
	import { Pagination as BitsPagination } from 'bits-ui';
	import IconCaretLeft from '@tabler/icons-svelte/icons/caret-left';
	import IconCaretRight from '@tabler/icons-svelte/icons/caret-right';

	interface Props extends BitsPagination.RootProps {
		showRange?: boolean;
	}

	let { count, perPage = 10, page = $bindable(), showRange = true, ...restProps }: Props = $props();
</script>

<BitsPagination.Root {count} {perPage} bind:page {...restProps}>
	{#snippet children({ pages, range })}
		<div class="flex flex-col items-center gap-4">
			<div class="flex items-center gap-2">
				<BitsPagination.PrevButton
					class="inline-flex size-10 items-center justify-center rounded-[9px] bg-transparent text-slate-600 ring-offset-2 transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 hover:disabled:bg-transparent"
				>
					<IconCaretLeft class="size-6" />
				</BitsPagination.PrevButton>

				<div class="flex items-center gap-2">
					{#each pages as page (page.key)}
						{#if page.type === 'ellipsis'}
							<div class="text-[15px] font-medium text-slate-500 select-none">...</div>
						{:else}
							<BitsPagination.Page
								{page}
								class="inline-flex size-10 items-center justify-center rounded-[9px] bg-transparent text-[15px] font-medium text-slate-700 ring-offset-2 transition-colors select-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 hover:disabled:bg-transparent data-[selected]:bg-brand-600 data-[selected]:text-white data-[selected]:hover:bg-brand-700"
							>
								{page.value}
							</BitsPagination.Page>
						{/if}
					{/each}
				</div>

				<BitsPagination.NextButton
					class="inline-flex size-10 items-center justify-center rounded-[9px] bg-transparent text-slate-600 ring-offset-2 transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 hover:disabled:bg-transparent"
				>
					<IconCaretRight class="size-6" />
				</BitsPagination.NextButton>
			</div>

			{#if showRange}
				<p class="text-center text-[13px] text-slate-500">
					Showing {range.start} - {range.end} of {count}
				</p>
			{/if}
		</div>
	{/snippet}
</BitsPagination.Root>
