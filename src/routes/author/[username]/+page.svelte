<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();

	onMount(() => {
		// Initialize DataTables
		if (typeof window !== 'undefined' && window.$) {
			// Load DataTables CSS and JS
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = '/stylesheets/dataTablesMaterialDesign.css';
			document.head.appendChild(link);

			const script = document.createElement('script');
			script.src = 'https://cdn.datatables.net/1.10.16/js/jquery.dataTables.min.js';
			script.onload = () => {
				const script2 = document.createElement('script');
				script2.src = '/javascripts/dataTablesMaterialDesign.js';
				script2.onload = () => {
					// Initialize DataTable
					if (window.$ && (window.$ as any).fn.DataTable) {
						(window.$ as any)('#pluginList').DataTable();
					}
				};
				document.body.appendChild(script2);
			};
			document.body.appendChild(script);
		}
	});
</script>

<svelte:head>
	<title>bStats - {data.username}</title>
	<meta name="description" content="bStats collects data for plugin authors. It's free and easy to use!" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@btobastian" />
	<meta name="twitter:title" content="{data.username} | bStats" />
	<meta name="twitter:description" content="Statistics about {data.username}!" />
	<meta name="twitter:image" content="https://bstats.org/images/Twitter.jpg" />
</svelte:head>

<div class="section no-pad-bot" id="index-banner">
	<div class="container">
		<br /><br />
		<h1 class="header center {data.customColor1}-text truncate">{data.username}</h1>
		<div class="row center">
			<h5 class="header col s12 light">Here are all the plugins created by {data.username}</h5>
		</div>
	</div>
</div>
<div class="container">
	<br /><br />
	<div class="row">
		<div id="admin" class="col s12">
			<div class="card material-table">
				<div style="overflow-x:auto;">
					<div style="min-width: 650px">
						<table id="pluginList">
							<thead>
								<tr>
									<th>Name</th>
									<th>Software</th>
								</tr>
							</thead>
							<tbody>
								{#each data.plugins as plugin}
									<tr>
										<td>
											<a href="/plugin/{plugin.software.url}/{plugin.name}/{plugin.id}"
												>{plugin.name}</a
											>
										</td>
										<td>
											{#if plugin.software.globalPlugin !== null}
												<a href="/global/{plugin.software.url}">{plugin.software.name}</a>
											{:else}
												{plugin.software.name}
											{/if}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
