<script>
	import Badge from '$lib/components/Badge.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
	<title>bStats - REST API</title>
	<meta name="description" content="REST documentation for bStats." />
</svelte:head>

<main class="pb-24">
	<PageHero>
		{#snippet badge()}<Badge>API</Badge>{/snippet}
		{#snippet title()}REST API{/snippet}
		{#snippet content()}
			Use the bStats REST API to embed plugin metrics in your site or tooling. All endpoints are
			read-only and return JSON.
		{/snippet}
	</PageHero>

	<section class="doc-container mt-12 space-y-12">
		<article class="doc-card space-y-4">
			<h2 class="doc-card-title">Getting started</h2>
			<p class="max-w-prose text-sm leading-relaxed text-slate-600">
				Requests are simple <code class="font-mono text-slate-700">GET</code> calls. No authentication
				is required for public data.
			</p>
			<div class="doc-callout doc-callout-note">
				These examples assume the API is reachable at <code class="font-mono text-slate-700"
					>https://bstats.org</code
				>.
			</div>
		</article>

		<article class="doc-card space-y-4">
			<h3 class="text-sm font-semibold tracking-[0.2em] text-slate-400 uppercase">List plugins</h3>
			<CodeBlock code="GET /api/v1/plugins" lang="http" />
			<p class="text-sm text-slate-600">Returns all plugins registered on bStats.</p>
			<CodeBlock
				code={`[
  {
    "id": 1337,
    "name": "ExamplePlugin",
    "owner": { "id": 42, "name": "ExampleUser" },
    "software": { "id": 1, "name": "Bukkit / Spigot", "url": "bukkit" },
    "isGlobal": false
  },
  ...
]`}
				lang="json"
			/>
		</article>

		<article class="doc-card space-y-4">
			<h3 class="text-sm font-semibold tracking-[0.2em] text-slate-400 uppercase">
				Plugin details
			</h3>
			<CodeBlock code={'GET /api/v1/plugins/{pluginId}'} lang="http" />
			<p class="text-sm text-slate-600">
				Returns metadata plus chart definitions for a specific plugin.
			</p>
			<CodeBlock
				code={`{
  "id": 1337,
  "name": "ExamplePlugin",
  "owner": { "id": 42, "name": "ExampleUser" },
  "charts": {
    "players": {
      "uid": 1234,
      "type": "single_linechart",
      "position": 0,
      "title": "Players",
      "isDefault": true,
      "data": {
        "lineName": "Players",
        "filter": { "enabled": false, "maxValue": null, "minValue": null }
      }
    }
  }
}`}
				lang="json"
			/>
		</article>

		<article class="doc-card space-y-4">
			<h3 class="text-sm font-semibold tracking-[0.2em] text-slate-400 uppercase">
				Charts for a plugin
			</h3>
			<CodeBlock code={'GET /api/v1/plugins/{pluginId}/charts'} lang="http" />
			<p class="text-sm text-slate-600">Returns the chart registry for a plugin.</p>
			<CodeBlock
				code={`{
  "players": {
    "uid": 1234,
    "type": "single_linechart",
    "position": 0,
    "title": "Players",
    "isDefault": true,
    "data": {
      "lineName": "Players",
      "filter": { "enabled": false, "maxValue": null, "minValue": null }
    }
  }
}`}
				lang="json"
			/>
		</article>

		<article class="doc-card space-y-4">
			<h3 class="text-sm font-semibold tracking-[0.2em] text-slate-400 uppercase">
				Chart metadata
			</h3>
			<CodeBlock code={'GET /api/v1/plugins/{pluginId}/charts/{chartId}'} lang="http" />
			<CodeBlock
				code={`{
  "uid": 1234,
  "type": "single_linechart",
  "position": 0,
  "title": "Players",
  "isDefault": true,
  "data": {
    "lineName": "Players",
    "filter": { "enabled": false, "maxValue": null, "minValue": null }
  }
}`}
				lang="json"
			/>
		</article>

		<article class="doc-card space-y-4">
			<h3 class="text-sm font-semibold tracking-[0.2em] text-slate-400 uppercase">Chart data</h3>
			<CodeBlock code={'GET /api/v1/plugins/{pluginId}/charts/{chartId}/data'} lang="http" />
			<p class="text-sm text-slate-600">
				Returns raw chart data. For line charts each entry is <code class="font-mono text-slate-700"
					>[timestamp, value]</code
				>.
			</p>
			<CodeBlock
				code={`[
  [1479799800000, 122],
  [1479801600000, 121],
  [1479803400000, 124],
  [1479805200000, 134]
]`}
				lang="json"
			/>
			<div class="doc-callout doc-callout-note">
				Append <code class="font-mono text-slate-700">?maxElements=&#123;amount&#125;</code> to limit
				the number of entries (line charts only).
			</div>
		</article>

		<article class="doc-card space-y-4">
			<h3 class="text-sm font-semibold tracking-[0.2em] text-slate-400 uppercase">
				Supported software
			</h3>
			<CodeBlock code="GET /api/v1/software" lang="http" />
			<CodeBlock
				code={`[
  {
    "id": 1,
    "name": "Bukkit / Spigot",
    "url": "bukkit",
    "globalPlugin": { "id": 1, "name": "_bukkit_" }
  },
  ...
]`}
				lang="json"
			/>
		</article>
	</section>
</main>
