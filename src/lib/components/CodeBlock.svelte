<script lang="ts">
	import { highlightCode } from '$lib/utils/shiki';
	import type { BundledLanguage } from 'shiki';

	type CodeBlockProps = {
		code: string;
		lang: BundledLanguage;
	};

	let { code, lang }: CodeBlockProps = $props();

	let highlightPromise = highlightCode(code, lang);
</script>

<div
	class="relative overflow-x-auto rounded-xl bg-slate-900 px-4 py-5 text-sm leading-relaxed shadow-inner sm:px-6 sm:py-6 [&>*]:bg-slate-900!"
>
	{#await highlightPromise}
		<pre class="text-slate-100"><code>{code}</code></pre>
	{:then html}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html html}
	{:catch}
		<pre class="text-slate-100"><code>{code}</code></pre>
	{/await}
</div>
