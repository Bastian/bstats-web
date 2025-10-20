<script lang="ts">
	import { onMount } from 'svelte';

	let searchValue = $state('');

	onMount(() => {
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
					const table = (window.$ as any)('#pluginList').DataTable({
						processing: true,
						ajax: {
							url: '/api/v1/datatable',
							dataSrc: '',
							cache: true
						},
						columns: [
							{ data: 'name' },
							{ data: 'softwareName' },
							{ data: 'ownerName' },
							{ data: 'servers' },
							{ data: 'players' }
						],
						order: [[3, 'desc']]
					});

					// Wire up custom search input
					(window.$ as any)(document).on('input', '#searchTable', function () {
						table.search((this as HTMLInputElement).value).draw();
					});
				}
			};
			document.body.appendChild(script2);
		};
		document.body.appendChild(script);
	});
</script>

<svelte:head>
	<title>bStats - Plugin list</title>
	<meta
		name="description"
		content="bStats collects data for plugin authors. It's free and easy to use!"
	/>
</svelte:head>

<main>
	<div class="container">
		<br /><br />
		<!-- Search form -->
		<div class="input-field">
			<i class="material-icons prefix grey-text text-darken-2" style="margin-top: 10px">search</i>
			<input id="searchTable" type="text" bind:value={searchValue} />
			<label for="searchTable">Search plugins</label>
		</div>
		<!-- Datatables design by Azamat Mukhiddinov (http://codepen.io/azamatms/pen/ZGwOMM/) -->
		<div class="row">
			<div id="admin" class="col s12">
				<div class="card material-table">
					<div class="table-header">
						<span class="table-title">Plugin List</span>
					</div>
					<div style="overflow-x:auto;">
						<div style="min-width: 650px">
							<table id="pluginList">
								<thead>
									<tr>
										<th>Name</th>
										<th>Software</th>
										<th>Owner</th>
										<th>Servers</th>
										<th>Players</th>
									</tr>
								</thead>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>
