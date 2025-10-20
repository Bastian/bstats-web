<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// State
	let selectedChartType = $state('');
	let filterEnabled = $state(false);
	let blacklistEnabled = $state(false);
	let deleteConfirmName = $state('');
	let newOwnerName = $state('');

	// Chart form data
	let chartTitle = $state('');
	let chartId = $state('');
	let filterItems = $state<string[]>([]);
	let filterInput = $state('');

	// Line chart specific
	let lineName = $state('');
	let minValue = $state('');
	let maxValue = $state('');

	// Pie chart specific
	let regexEnabled = $state(false);
	let maxValuePie = $state('');

	// Modals
	let showErrorModal = $state(false);
	let errorTitle = $state('');
	let errorMessage = $state('');
	let showChartCreatedModal = $state(false);
	let createdChartId = $state('');
	let createdChartTitle = $state('');
	let showTransferModal = $state(false);

	// Derived
	let deleteButtonEnabled = $derived(deleteConfirmName === data.plugin.name);
	let sortedCharts = $derived(
		Object.keys(data.charts).sort(
			(a, b) => data.charts[a].position - data.charts[b].position
		)
	);

	// Auto-generate chart ID from title
	$effect(() => {
		if (chartTitle) {
			chartId = chartTitle.toLowerCase().replace(/ /g, '_');
		}
	});

	onMount(() => {
		// Initialize Materialize components
		if (typeof window !== 'undefined' && window.$) {
			(window.$ as any)('select').material_select();
			(window.$ as any)('.modal').modal();

			// Handle chart type selection change
			(window.$ as any)('#select_chart').on('change', function() {
				selectedChartType = (this as HTMLSelectElement).value;
				resetChartForm();
			});

			// Initialize sortable
			loadSortable();
		}
	});

	function loadSortable() {
		if (typeof window !== 'undefined') {
			const script = document.createElement('script');
			script.src = '//cdnjs.cloudflare.com/ajax/libs/Sortable/1.4.2/Sortable.min.js';
			script.onload = () => {
				initializeSortable();
			};
			document.body.appendChild(script);
		}
	}

	function initializeSortable() {
		const chartsList = document.getElementById('chartsList');
		if (chartsList && (window as any).Sortable) {
			(window as any).Sortable.create(chartsList, {
				animation: 150,
				handle: '.glyphicon-move',
				onEnd: async (event: any) => {
					if (event.oldIndex === event.newIndex) return;
					if (event.oldIndex === undefined || event.newIndex === undefined) return;

					// Call reorder action
					const formData = new FormData();
					formData.append('oldIndex', event.oldIndex.toString());
					formData.append('newIndex', event.newIndex.toString());

					await fetch(`?/reorderCharts`, {
						method: 'POST',
						body: formData
					});
				}
			});
		}
	}

	function resetChartForm() {
		chartTitle = '';
		chartId = '';
		filterItems = [];
		filterInput = '';
		filterEnabled = false;
		regexEnabled = false;
		blacklistEnabled = false;
		lineName = '';
		minValue = '';
		maxValue = '';
		maxValuePie = '';
	}

	function addFilterItem() {
		if (filterInput.trim()) {
			filterItems = [...filterItems, filterInput.trim()];
			filterInput = '';
		}
	}

	function removeFilterItem(index: number) {
		filterItems = filterItems.filter((_, i) => i !== index);
	}

	async function submitChart(chartType: string) {
		const formData = new FormData();
		formData.append('chart_type', chartType);
		formData.append('chartTitle', chartTitle);
		formData.append('chartId', chartId);
		formData.append('filterEnabled', filterEnabled.toString());

		if (filterEnabled) {
			formData.append('filter', JSON.stringify(filterItems));

			if (chartType === 'simple_pie' || chartType === 'advanced_pie' || chartType === 'drilldown_pie') {
				formData.append('regexEnabled', regexEnabled.toString());
				formData.append('blacklistEnabled', blacklistEnabled.toString());
				if (chartType !== 'simple_pie') {
					formData.append('maxValue', maxValuePie);
				}
			}

			if (chartType === 'single_linechart') {
				formData.append('lineName', lineName);
				formData.append('minValue', minValue);
				formData.append('maxValue', maxValue);
			}
		} else if (chartType === 'single_linechart') {
			formData.append('lineName', lineName);
		}

		const response = await fetch(`?/addChart`, {
			method: 'POST',
			body: formData
		});

		const result = await response.json();
		if (response.ok && result.type === 'success') {
			createdChartTitle = chartTitle;
			createdChartId = chartId;
			showChartCreatedModal = true;
			resetChartForm();
			setTimeout(() => location.reload(), 1000);
		} else {
			errorTitle = 'Error';
			errorMessage = result.data?.error || 'Failed to create chart';
			showErrorModal = true;
		}
	}

	async function deleteChart(chartId: string) {
		if (!confirm(`Are you sure you want to delete the chart with id ${chartId}?`)) {
			return;
		}

		const formData = new FormData();
		formData.append('chartId', chartId);

		const response = await fetch(`?/deleteChart`, {
			method: 'POST',
			body: formData
		});

		const result = await response.json();
		if (response.ok) {
			location.reload();
		} else {
			errorTitle = 'Error';
			errorMessage = result.data?.error || 'Failed to delete chart';
			showErrorModal = true;
		}
	}

	async function deletePlugin() {
		const formData = new FormData();
		formData.append('confirm', 'true');

		const response = await fetch(`?/deletePlugin`, {
			method: 'POST',
			body: formData
		});

		if (response.ok || response.redirected) {
			goto('/');
		} else {
			const result = await response.json();
			errorTitle = 'Error';
			errorMessage = result.data?.error || 'Failed to delete plugin';
			showErrorModal = true;
		}
	}

	async function transferOwnership() {
		const formData = new FormData();
		formData.append('newOwner', newOwnerName);

		const response = await fetch(`?/transferOwnership`, {
			method: 'POST',
			body: formData
		});

		const result = await response.json();
		if (response.ok && result.type === 'success') {
			showTransferModal = true;
		} else {
			errorTitle = 'Error';
			errorMessage = result.data?.error || 'Failed to transfer ownership';
			showErrorModal = true;
		}
	}
</script>

<svelte:head>
	<title>bStats - Edit {data.plugin.name}</title>
	<meta name="description" content="Edit your plugin" />
	<style>
		.depending_box {
			display: none;
		}
		.blacklistLabel {
			display: none;
		}
		.filterOptions {
			display: none;
		}
		.chip {
			display: inline-block;
			padding: 0 12px;
			height: 32px;
			line-height: 32px;
			border-radius: 16px;
			background-color: #e4e4e4;
			margin: 2px;
		}
		.chip .close {
			cursor: pointer;
			float: right;
			font-size: 16px;
			line-height: 32px;
			padding-left: 8px;
		}
	</style>
</svelte:head>

<main>
	{#if !data.canEdit}
		<div class="container">
			<br /><br />
			<div class="row">
				<div class="col s12">
					<div class="card red">
						<div class="card-content white-text">
							<span class="card-title">Access Denied</span>
							<p>You are not the owner of this plugin.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<br /><br />
		<div class="container row">
			<!-- Add Chart Section -->
			<h5 class="{data.customColor1}-text col s12 center-align">
				Add custom chart
				<a href="/help/custom-charts">
					<i class="material-icons blue-text" style="font-size: 20px">help</i>
				</a>
			</h5>

			<br /><br />
			<div class="col s12 z-depth-1 grey lighten-4 row">
				<br />
				<div class="input-field col s12">
					<select id="select_chart">
						<option value="" disabled selected>Choose a chart type</option>
						<optgroup label="Pies">
							<option value="simple_pie">Simple Pie</option>
							<option value="advanced_pie">Advanced Pie</option>
							<option value="drilldown_pie">Drilldown Pie</option>
						</optgroup>
						<optgroup label="Line Charts">
							<option value="single_linechart">Single line Chart</option>
							<option value="multi_linechart" disabled>Multi line Chart</option>
						</optgroup>
						<optgroup label="Bar Charts">
							<option value="simple_bar" disabled>Simple Bar Chart</option>
							<option value="advanced_bar" disabled>Advanced Bar Chart</option>
						</optgroup>
						<optgroup label="Miscellaneous">
							<option value="mapchart" disabled>Map Chart</option>
						</optgroup>
					</select>
					<label>Chart type</label>
				</div>

				<!-- Simple Pie Form -->
				<div class="depending_box simple_pie" style:display={selectedChartType === 'simple_pie' ? 'block' : 'none'}>
					<div class="col s12">
						<br />
						<div class="input-field">
							<input
								placeholder="The title of the chart"
								type="text"
								bind:value={chartTitle}
								pattern="^[-_a-zA-Z0-9]+(\s[-_a-zA-Z0-9]+)*$"
								maxlength="32"
								class="validate"
							/>
							<label for="chart_title">Chart title</label>
						</div>
						<div class="input-field">
							<input
								placeholder="Give the chart an unique id (e.g. 'myChart1')"
								type="text"
								bind:value={chartId}
								pattern="^[-_a-zA-Z0-9]+([-_a-zA-Z0-9]+)*$"
								maxlength="32"
								class="validate"
							/>
							<label for="chart_id">Chart id</label>
						</div>

						<div class="divider"></div>
						<br />
						<div class="switch">
							<b>Filter data</b>
							<label>
								<input type="checkbox" bind:checked={filterEnabled} />
								<span class="lever"></span>
							</label>
						</div>
						<br />

						{#if filterEnabled}
							<div class="filterOptions" style="display: block;">
								<div class="divider"></div>
								<br />
								<div class="switch">
									<b>Regex&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>
									<label>
										<input type="checkbox" bind:checked={regexEnabled} />
										<span class="lever"></span>
									</label>
								</div>
								<br />
								<div class="divider"></div>
								<br />
								<div class="switch">
									<b>Blacklist&nbsp;&nbsp;&nbsp;&nbsp;</b>
									<label>
										<input type="checkbox" bind:checked={blacklistEnabled} />
										<span class="lever"></span>
									</label>
								</div>
								<br />
								<div class="divider"></div>
								<br />
								<b class="whitelistLabel" class:hide={blacklistEnabled}>Whitelist: </b>
								<b class="blacklistLabel" style:display={blacklistEnabled ? 'inline' : 'none'}>Blacklist: </b>
								<div class="chips-container">
									<div class="input-field inline">
										<input type="text" bind:value={filterInput} onkeydown={(e) => e.key === 'Enter' && (addFilterItem(), e.preventDefault())} />
										<button type="button" class="btn-small" onclick={addFilterItem}>Add</button>
									</div>
									<div>
										{#each filterItems as item, i}
											<div class="chip">
												{item}
												<span class="close" onclick={() => removeFilterItem(i)}>&times;</span>
											</div>
										{/each}
									</div>
								</div>
							</div>
						{/if}

						<div class="row">
							<button
								type="button"
								class="col s12 l6 offset-l3 btn btn-large waves-effect {data.customColor1}"
								onclick={() => submitChart('simple_pie')}
							>
								Submit Chart
							</button>
						</div>
					</div>
				</div>

				<!-- Advanced Pie Form -->
				<div class="depending_box advanced_pie" style:display={selectedChartType === 'advanced_pie' ? 'block' : 'none'}>
					<div class="col s12">
						<br />
						<div class="input-field">
							<input
								placeholder="The title of the chart"
								type="text"
								bind:value={chartTitle}
								pattern="^[-_a-zA-Z0-9]+(\s[-_a-zA-Z0-9]+)*$"
								maxlength="32"
								class="validate"
							/>
							<label>Chart title</label>
						</div>
						<div class="input-field">
							<input
								placeholder="Give the chart an unique id (e.g. 'myChart1')"
								type="text"
								bind:value={chartId}
								pattern="^[-_a-zA-Z0-9]+([-_a-zA-Z0-9]+)*$"
								maxlength="32"
								class="validate"
							/>
							<label>Chart id</label>
						</div>

						<div class="divider"></div>
						<br />
						<div class="switch">
							<b>Filter data</b>
							<label>
								<input type="checkbox" bind:checked={filterEnabled} />
								<span class="lever"></span>
							</label>
						</div>
						<br />

						{#if filterEnabled}
							<div class="filterOptions" style="display: block;">
								<div class="divider"></div>
								<br />
								<div class="input-field">
									<input
										placeholder="Leave empty for no filtering"
										type="text"
										bind:value={maxValuePie}
										pattern="^[0-9]*$"
										maxlength="16"
									/>
									<label>Max value per pie slice</label>
								</div>
								<br />
								<div class="switch">
									<b>Regex&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>
									<label>
										<input type="checkbox" bind:checked={regexEnabled} />
										<span class="lever"></span>
									</label>
								</div>
								<br />
								<div class="divider"></div>
								<br />
								<div class="switch">
									<b>Blacklist&nbsp;&nbsp;&nbsp;&nbsp;</b>
									<label>
										<input type="checkbox" bind:checked={blacklistEnabled} />
										<span class="lever"></span>
									</label>
								</div>
								<br />
								<div class="divider"></div>
								<br />
								<b class:hide={blacklistEnabled}>Whitelist: </b>
								<b style:display={blacklistEnabled ? 'inline' : 'none'}>Blacklist: </b>
								<div class="chips-container">
									<div class="input-field inline">
										<input type="text" bind:value={filterInput} onkeydown={(e) => e.key === 'Enter' && (addFilterItem(), e.preventDefault())} />
										<button type="button" class="btn-small" onclick={addFilterItem}>Add</button>
									</div>
									<div>
										{#each filterItems as item, i}
											<div class="chip">
												{item}
												<span class="close" onclick={() => removeFilterItem(i)}>&times;</span>
											</div>
										{/each}
									</div>
								</div>
							</div>
						{/if}

						<div class="row">
							<button
								type="button"
								class="col s12 l6 offset-l3 btn btn-large waves-effect {data.customColor1}"
								onclick={() => submitChart('advanced_pie')}
							>
								Submit Chart
							</button>
						</div>
					</div>
				</div>

				<!-- Drilldown Pie Form (same as advanced) -->
				<div class="depending_box drilldown_pie" style:display={selectedChartType === 'drilldown_pie' ? 'block' : 'none'}>
					<div class="col s12">
						<br />
						<div class="input-field">
							<input
								placeholder="The title of the chart"
								type="text"
								bind:value={chartTitle}
								pattern="^[-_a-zA-Z0-9]+(\s[-_a-zA-Z0-9]+)*$"
								maxlength="32"
								class="validate"
							/>
							<label>Chart title</label>
						</div>
						<div class="input-field">
							<input
								placeholder="Give the chart an unique id (e.g. 'myChart1')"
								type="text"
								bind:value={chartId}
								pattern="^[-_a-zA-Z0-9]+([-_a-zA-Z0-9]+)*$"
								maxlength="32"
								class="validate"
							/>
							<label>Chart id</label>
						</div>

						<div class="divider"></div>
						<br />
						<div class="switch">
							<b>Filter data</b>
							<label>
								<input type="checkbox" bind:checked={filterEnabled} />
								<span class="lever"></span>
							</label>
						</div>
						<br />

						{#if filterEnabled}
							<div class="filterOptions" style="display: block;">
								<div class="divider"></div>
								<br />
								<div class="input-field">
									<input
										placeholder="Leave empty for no filtering"
										type="text"
										bind:value={maxValuePie}
										pattern="^[0-9]*$"
										maxlength="16"
									/>
									<label>Max value per pie slice</label>
								</div>
								<br />
								<div class="switch">
									<b>Regex&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>
									<label>
										<input type="checkbox" bind:checked={regexEnabled} />
										<span class="lever"></span>
									</label>
								</div>
								<br />
								<div class="divider"></div>
								<br />
								<div class="switch">
									<b>Blacklist&nbsp;&nbsp;&nbsp;&nbsp;</b>
									<label>
										<input type="checkbox" bind:checked={blacklistEnabled} />
										<span class="lever"></span>
									</label>
								</div>
								<br />
								<div class="divider"></div>
								<br />
								<b class:hide={blacklistEnabled}>Whitelist: </b>
								<b style:display={blacklistEnabled ? 'inline' : 'none'}>Blacklist: </b>
								<div class="chips-container">
									<div class="input-field inline">
										<input type="text" bind:value={filterInput} onkeydown={(e) => e.key === 'Enter' && (addFilterItem(), e.preventDefault())} />
										<button type="button" class="btn-small" onclick={addFilterItem}>Add</button>
									</div>
									<div>
										{#each filterItems as item, i}
											<div class="chip">
												{item}
												<span class="close" onclick={() => removeFilterItem(i)}>&times;</span>
											</div>
										{/each}
									</div>
								</div>
							</div>
						{/if}

						<div class="row">
							<button
								type="button"
								class="col s12 l6 offset-l3 btn btn-large waves-effect {data.customColor1}"
								onclick={() => submitChart('drilldown_pie')}
							>
								Submit Chart
							</button>
						</div>
					</div>
				</div>

				<!-- Single Line Chart Form -->
				<div class="depending_box single_linechart" style:display={selectedChartType === 'single_linechart' ? 'block' : 'none'}>
					<div class="col s12">
						<br />
						<div class="input-field">
							<input
								placeholder="The title of the chart"
								type="text"
								bind:value={chartTitle}
								pattern="^[-_a-zA-Z0-9]+(\s[-_a-zA-Z0-9]+)*$"
								maxlength="32"
								class="validate"
							/>
							<label>Chart title</label>
						</div>
						<div class="input-field">
							<input
								placeholder="Give the chart an unique id (e.g. 'myChart1')"
								type="text"
								bind:value={chartId}
								pattern="^[-_a-zA-Z0-9]+([-_a-zA-Z0-9]+)*$"
								maxlength="32"
								class="validate"
							/>
							<label>Chart id</label>
						</div>
						<div class="input-field">
							<input
								placeholder="The name of the line (e.g. 'Players')"
								type="text"
								bind:value={lineName}
								pattern="^[-_a-zA-Z0-9]+(\s[-_a-zA-Z0-9]+)*$"
								maxlength="50"
								class="validate"
							/>
							<label>Line name</label>
						</div>

						<div class="divider"></div>
						<br />
						<div class="switch">
							<b>Filter data</b>
							<label>
								<input type="checkbox" bind:checked={filterEnabled} />
								<span class="lever"></span>
							</label>
						</div>
						<br />

						{#if filterEnabled}
							<div class="filterOptions" style="display: block;">
								<div class="divider"></div>
								<br />
								<div class="input-field">
									<input
										placeholder="Leave empty for no filtering"
										type="text"
										bind:value={maxValue}
										pattern="^[0-9]*$"
										maxlength="16"
									/>
									<label>Max value</label>
								</div>
								<br />
								<div class="input-field">
									<input
										placeholder="Leave empty for no filtering"
										type="text"
										bind:value={minValue}
										pattern="^[0-9]*$"
										maxlength="16"
									/>
									<label>Min value</label>
								</div>
							</div>
						{/if}

						<div class="row">
							<button
								type="button"
								class="col s12 l6 offset-l3 btn btn-large waves-effect {data.customColor1}"
								onclick={() => submitChart('single_linechart')}
							>
								Submit Chart
							</button>
						</div>
					</div>
				</div>

				<!-- Coming Soon Messages -->
				<div class="depending_box" style:display={['simple_bar', 'advanced_bar'].includes(selectedChartType) ? 'block' : 'none'}>
					<div class="col s12">
						<h2 class="red-text center-align">Coming (back) soon™</h2>
						<div class="center-align">No ETA, but it's being worked on!</div>
						<br /><br />
					</div>
				</div>

				<div class="depending_box" style:display={selectedChartType === 'multi_linechart' ? 'block' : 'none'}>
					<div class="col s12">
						<h2 class="red-text center-align">Coming soon™</h2>
						<div class="center-align">No ETA, but it's being worked on!</div>
						<br /><br />
					</div>
				</div>

				<div class="depending_box" style:display={selectedChartType === 'mapchart' ? 'block' : 'none'}>
					<div class="col s12">
						<h2 class="red-text center-align">Not available</h2>
						<div class="center-align">There's not much interest in map charts, so they aren't available.</div>
						<br /><br />
					</div>
				</div>
			</div>

			<!-- Edit Charts Section -->
			{#if sortedCharts.length > 0}
				<h5 class="{data.customColor1}-text col s12 center-align">Edit charts</h5>
				<br /><br />
				<ul id="chartsList" class="list-group collection col s12 z-depth-1 grey lighten-4">
					{#each sortedCharts as chartId}
						<li class="list-group-item collection-item grey lighten-4" id="listElement_{chartId}">
							<div>
								<i class="material-icons left glyphicon-move">drag_handle</i>
								<a href="/plugin/{data.softwareUrl}/{data.plugin.name}/{data.plugin.id}/#{chartId}">
									<b>{data.charts[chartId].title}</b> (id: {chartId})
								</a>
								<a
									href="javascript:void(0)"
									onclick={() => {
										errorTitle = 'Not supported';
										errorMessage = 'Editing existing charts is not supported at the moment!';
										showErrorModal = true;
									}}
									class="secondary-content"
								>
									<i class="material-icons" title="Edit chart">build</i>
								</a>
								{#if data.charts[chartId].isDefault}
									<a class="secondary-content">
										<i class="material-icons grey-text" title="Delete chart">delete</i>&nbsp;&nbsp;
									</a>
								{:else}
									<a href="javascript:void(0)" onclick={() => deleteChart(chartId)} class="secondary-content">
										<i class="material-icons red-text" title="Delete chart">delete</i>&nbsp;&nbsp;
									</a>
								{/if}
							</div>
						</li>
					{/each}
				</ul>
			{/if}

			<!-- Delete Plugin Section -->
			<h5 class="{data.customColor1}-text col s12 center-align">Delete plugin</h5>
			<br /><br />
			<div class="col s12 z-depth-1 grey lighten-4 row">
				<br />
				<div class="input-field">
					<input
						placeholder="Please type in the name of the plugin to confirm."
						type="text"
						bind:value={deleteConfirmName}
						class="validate"
					/>
					<label>Plugin name</label>
				</div>
				<br />
				<div class="col s12">
					<div class="row">
						<button
							type="button"
							class="col s12 l6 offset-l3 btn-large red waves-effect waves-light"
							class:disabled={!deleteButtonEnabled}
							onclick={deletePlugin}
							disabled={!deleteButtonEnabled}
						>
							Delete
						</button>
					</div>
				</div>
			</div>

			<!-- Transfer Ownership Section (Admin Only) -->
			{#if data.user?.admin}
				<h5 class="{data.customColor1}-text col s12 center-align">Transfer ownership</h5>
				<br /><br />
				<div class="col s12 z-depth-1 grey lighten-4 row">
					<br />
					<div class="input-field">
						<input
							placeholder="Please type in the name of new owner."
							type="text"
							bind:value={newOwnerName}
						/>
						<label>New owner</label>
					</div>
					<br />
					<div class="col s12">
						<div class="row">
							<button
								type="button"
								class="col s12 l6 offset-l3 btn-large red waves-effect waves-light"
								onclick={transferOwnership}
							>
								Transfer
							</button>
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</main>

<!-- Error Modal -->
{#if showErrorModal}
	<div class="modal" style="display: block; opacity: 1; transform: scaleX(1) scaleY(1);">
		<div class="modal-content">
			<h4 class="red-text">{errorTitle}</h4>
			<p>{errorMessage}</p>
		</div>
		<div class="modal-footer">
			<button class="modal-close waves-effect btn-flat" onclick={() => (showErrorModal = false)}>OK</button>
		</div>
	</div>
	<div class="modal-overlay" onclick={() => (showErrorModal = false)}></div>
{/if}

<!-- Chart Created Modal -->
{#if showChartCreatedModal}
	<div class="modal" style="display: block; opacity: 1; transform: scaleX(1) scaleY(1);">
		<div class="modal-content">
			<h4 class="green-text">Chart created</h4>
			<p>Chart <b>{createdChartTitle}</b> was successfully created!</p>
		</div>
		<div class="modal-footer">
			<a
				href="/plugin/{data.softwareUrl}/{data.plugin.name}/#{createdChartId}"
				class="modal-close waves-effect btn-flat grey-text"
			>
				<b>View chart</b>
			</a>
			<button class="modal-close waves-effect btn-flat grey-text" onclick={() => (showChartCreatedModal = false)}>
				<b>Keep editing</b>
			</button>
		</div>
	</div>
	<div class="modal-overlay" onclick={() => (showChartCreatedModal = false)}></div>
{/if}

<!-- Transfer Ownership Modal -->
{#if showTransferModal}
	<div class="modal" style="display: block; opacity: 1; transform: scaleX(1) scaleY(1);">
		<div class="modal-content">
			<h4 class="green-text">Transferred Ownership</h4>
			<p><b>{newOwnerName}</b> is now the new owner of this plugin!</p>
		</div>
		<div class="modal-footer">
			<button class="modal-close waves-effect btn-flat green-text" onclick={() => (showTransferModal = false)}>
				<b>OK</b>
			</button>
		</div>
	</div>
	<div class="modal-overlay" onclick={() => (showTransferModal = false)}></div>
{/if}
