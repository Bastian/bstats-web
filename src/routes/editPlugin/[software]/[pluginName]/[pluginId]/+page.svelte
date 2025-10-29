<script lang="ts">
	import { resolve } from '$app/paths';
	import Badge from '$lib/components/Badge.svelte';
	import Button from '$lib/components/Button.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import type { PageData, ActionData } from './$types';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// State
	let selectedChartType = $state('');
	let feedbackMessage = $state('');
	let feedbackType = $state<'success' | 'error' | ''>('');
	let feedbackLink = $state('');

	// Chart form state
	let chartTitle = $state('');
	let chartId = $state('');

	// Simple Pie state
	let simplePieFilterEnabled = $state(false);
	let simplePieFilterValues = $state('');
	let simplePieRegex = $state(false);
	let simplePieFilterMode = $state('whitelist');

	// Advanced Pie state
	let advancedPieFilterEnabled = $state(false);
	let advancedPieFilterValues = $state('');
	let advancedPieRegex = $state(false);
	let advancedPieFilterMode = $state('whitelist');
	let advancedPieMaxValue = $state('');

	// Drilldown Pie state
	let drilldownPieFilterEnabled = $state(false);
	let drilldownPieFilterValues = $state('');
	let drilldownPieRegex = $state(false);
	let drilldownPieFilterMode = $state('whitelist');
	let drilldownPieMaxValue = $state('');

	// Single Line Chart state
	let singleLineFilterEnabled = $state(false);
	let singleLineMinValue = $state('');
	let singleLineMaxValue = $state('');
	let singleLineLineName = $state('');

	// Delete plugin state
	let deleteConfirmName = $state('');
	let deleteButtonEnabled = $derived(deleteConfirmName.trim() === data.plugin.name);

	// Transfer ownership state
	let newOwnerName = $state('');

	// Auto-generate chart ID from title
	$effect(() => {
		if (chartTitle) {
			chartId = chartTitle.toLowerCase().replace(/\s+/g, '_');
		}
	});

	// Sorted charts for display - convert to array with ids for dnd
	let sortedCharts = $state(
		Object.keys(data.charts || {})
			.sort((a, b) => data.charts[a].position - data.charts[b].position)
			.map((chartId) => ({ id: chartId, chartId }))
	);

	// Recalculate when data.charts changes
	$effect(() => {
		if (data.charts) {
			sortedCharts = Object.keys(data.charts)
				.sort((a, b) => data.charts[a].position - data.charts[b].position)
				.map((chartId) => ({ id: chartId, chartId }));
		}
	});

	const flipDurationMs = 200;
	let draggedItemOriginalIndex = $state(-1);

	function handleDndConsider(e: CustomEvent) {
		console.log('handleDndConsider called', e.detail);

		// Store the original index when drag starts
		if (e.detail.info.trigger === 'dragStarted') {
			for (let i = 0; i < sortedCharts.length; i++) {
				if (sortedCharts[i].id === e.detail.info.id) {
					draggedItemOriginalIndex = i;
					console.log('Drag started, original index:', draggedItemOriginalIndex);
					break;
				}
			}
		}

		sortedCharts = e.detail.items;
	}

	async function handleDndFinalize(e: CustomEvent) {
		console.log('handleDndFinalize called', e.detail);
		const items = e.detail.items;

		// Find the new position
		let newIndex = -1;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id === e.detail.info.id) {
				newIndex = i;
				break;
			}
		}

		const oldIndex = draggedItemOriginalIndex;
		console.log('oldIndex:', oldIndex, 'newIndex:', newIndex);

		sortedCharts = items;

		if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
			console.log('Sending reorder request...');
			try {
				const response = await fetch(`${window.location.pathname}?/reorderCharts`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: new URLSearchParams({
						oldIndex: oldIndex.toString(),
						newIndex: newIndex.toString()
					})
				});

				console.log('Response:', response.status, response.ok);

				if (!response.ok) {
					throw new Error('Failed to reorder charts');
				}
			} catch (error) {
				console.error('Failed to reorder charts:', error);
				showFeedback('error', 'Failed to reorder charts. Please refresh and try again.');
			}
		} else {
			console.log('No reorder needed');
		}

		// Reset the original index
		draggedItemOriginalIndex = -1;
	}

	function showFeedback(type: 'success' | 'error', message: string, link?: string) {
		feedbackType = type;
		feedbackMessage = message;
		feedbackLink = link || '';
	}

	function parseValues(text: string): string[] {
		return text
			.split(/\r?\n/)
			.map((line) => line.trim())
			.filter(Boolean);
	}

	async function addChart(chartType: string) {
		const formData = new FormData();
		formData.append('chart_type', chartType);
		formData.append('chartTitle', chartTitle);
		formData.append('chartId', chartId);

		switch (chartType) {
			case 'simple_pie':
				formData.append('filterEnabled', simplePieFilterEnabled.toString());
				if (simplePieFilterEnabled) {
					formData.append('filter', JSON.stringify(parseValues(simplePieFilterValues)));
					formData.append('regexEnabled', simplePieRegex.toString());
					formData.append('blacklistEnabled', (simplePieFilterMode === 'blacklist').toString());
				}
				break;
			case 'advanced_pie':
				formData.append('maxValue', advancedPieMaxValue);
				formData.append('filterEnabled', advancedPieFilterEnabled.toString());
				if (advancedPieFilterEnabled) {
					formData.append('filter', JSON.stringify(parseValues(advancedPieFilterValues)));
					formData.append('regexEnabled', advancedPieRegex.toString());
					formData.append('blacklistEnabled', (advancedPieFilterMode === 'blacklist').toString());
				}
				break;
			case 'drilldown_pie':
				formData.append('maxValue', drilldownPieMaxValue);
				formData.append('filterEnabled', drilldownPieFilterEnabled.toString());
				if (drilldownPieFilterEnabled) {
					formData.append('filter', JSON.stringify(parseValues(drilldownPieFilterValues)));
					formData.append('regexEnabled', drilldownPieRegex.toString());
					formData.append('blacklistEnabled', (drilldownPieFilterMode === 'blacklist').toString());
				}
				break;
			case 'single_linechart':
				formData.append('lineName', singleLineLineName);
				formData.append('filterEnabled', singleLineFilterEnabled.toString());
				if (singleLineFilterEnabled) {
					formData.append('minValue', singleLineMinValue);
					formData.append('maxValue', singleLineMaxValue);
				}
				break;
		}

		try {
			const response = await fetch(`${window.location.pathname}?/addChart`, {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				showFeedback(
					'success',
					`Chart "${chartTitle}" created successfully.`,
					`/plugin/${data.softwareUrl}/${data.plugin.name}/${data.plugin.id}#${chartId}`
				);
				setTimeout(() => location.reload(), 1500);
			} else {
				const result = await response.json();
				showFeedback('error', result.error || 'Something went wrong. Please try again.');
			}
		} catch (error) {
			showFeedback('error', 'Something went wrong. Please try again.');
		}
	}

	async function deleteChart(chartId: string) {
		if (!confirm(`Delete chart "${chartId}"?`)) {
			return;
		}

		try {
			const response = await fetch(`${window.location.pathname}?/deleteChart`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({
					chartId: chartId
				})
			});

			if (response.ok) {
				// Remove from sortedCharts array reactively
				sortedCharts = sortedCharts.filter((item) => item.chartId !== chartId);
				showFeedback('success', `Chart "${chartId}" deleted.`);
			} else {
				const result = await response.json();
				showFeedback('error', result.error || 'Failed to delete chart.');
			}
		} catch (error) {
			showFeedback('error', 'Failed to delete chart.');
		}
	}

	async function deletePlugin() {
		if (!confirm(`Delete plugin "${data.plugin.name}"? This cannot be undone.`)) {
			return;
		}

		try {
			const response = await fetch(`${window.location.pathname}?/deletePlugin`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({})
			});

			if (response.ok || response.redirected) {
				window.location.href = '/';
			} else {
				const result = await response.json();
				showFeedback('error', result.error || 'Something went wrong.');
			}
		} catch (error) {
			showFeedback('error', 'Something went wrong.');
		}
	}

	async function transferOwnership() {
		const newOwner = newOwnerName.trim();
		if (!newOwner) {
			showFeedback('error', 'Please enter a username to transfer ownership.');
			return;
		}

		try {
			const response = await fetch(`${window.location.pathname}?/transferOwnership`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({
					newOwner: newOwner
				})
			});

			if (response.ok) {
				showFeedback('success', `Ownership transferred to ${newOwner}.`);
			} else {
				const result = await response.json();
				showFeedback('error', result.error || 'Transfer failed.');
			}
		} catch (error) {
			showFeedback('error', 'Transfer failed.');
		}
	}
</script>

<svelte:head>
	<title>bStats - Edit {data.plugin.name}</title>
	<meta name="description" content="Edit your plugin" />
</svelte:head>

<main class="pb-24">
	{#if !data.canEdit}
		<PageHero>
			{#snippet badge()}<Badge type="error">Access Denied</Badge>{/snippet}
			{#snippet title()}Nice try!{/snippet}
			{#snippet content()}
				Only the owner of <span class="font-semibold text-slate-900">{data.plugin.name}</span> can edit
				this plugin.
			{/snippet}
		</PageHero>
	{:else}
		<PageHero>
			{#snippet badge()}<Badge>Plugin</Badge>{/snippet}
			{#snippet title()}{data.plugin.name}{/snippet}
			{#snippet content()}
				Manage charts, transfers, and cleanup for your plugin. Changes appear instantly on the
				public dashboard.
			{/snippet}
			{#snippet extra()}
				<div class="flex flex-wrap gap-3 text-sm text-slate-500">
					<span
						class="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
					>
						<span class="h-2 w-2 rounded-full bg-brand-500"></span>
						Owner: {data.plugin.owner}
					</span>
					<span
						class="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
					>
						Plugin ID: {data.plugin.id}
					</span>
				</div>

				<Button href={resolve(`/plugin/${data.softwareUrl}/${data.plugin.name}/${data.plugin.id}`)}>
					View public page
				</Button>
			{/snippet}
		</PageHero>

		<section class="doc-container mt-12 space-y-8">
			{#if feedbackMessage}
				<div
					class="rounded-2xl border px-4 py-4 text-sm sm:px-5 sm:py-5 {feedbackType === 'error'
						? 'border-rose-200 bg-rose-50 text-rose-700'
						: 'border-emerald-200 bg-emerald-50 text-emerald-700'}"
				>
					<span>{feedbackMessage}</span>
					{#if feedbackLink}
						<a
							href={feedbackLink}
							class="ml-2 font-semibold text-brand-600 hover:text-brand-700"
							target="_blank"
							rel="noopener">View chart</a
						>
					{/if}
				</div>
			{/if}

			<div class="grid gap-8 lg:grid-cols-2">
				<!-- Add Chart Card -->
				<article class="doc-card space-y-6">
					<div class="flex items-start justify-between gap-4">
						<div>
							<h2 class="font-display text-xl font-semibold text-slate-900">Add custom chart</h2>
							<p class="mt-1 text-sm text-slate-500">
								Create a new chart to display on your plugin page
							</p>
						</div>
						<a
							href={resolve('/docs/custom-charts')}
							class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition hover:bg-blue-200"
							title="Help with custom charts"
						>
							<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</a>
					</div>

					<div class="input-group">
						<label class="input-label" for="select_chart">Chart type</label>
						<select id="select_chart" class="input-control" bind:value={selectedChartType}>
							<option value="" disabled>Choose a chart type</option>
							<optgroup label="Pies">
								<option value="simple_pie">Simple Pie</option>
								<option value="advanced_pie">Advanced Pie</option>
								<option value="drilldown_pie">Drilldown Pie</option>
							</optgroup>
							<optgroup label="Line Charts">
								<option value="single_linechart">Single Line Chart</option>
							</optgroup>
						</select>
					</div>

					<!-- Simple Pie Form -->
					{#if selectedChartType === 'simple_pie'}
						<div class="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
							<div class="input-group">
								<label class="input-label" for="chart_title_simple_pie">Chart title</label>
								<input
									id="chart_title_simple_pie"
									type="text"
									class="input-control"
									placeholder="The title of the chart"
									bind:value={chartTitle}
									maxlength="32"
								/>
							</div>
							<div class="input-group">
								<label class="input-label" for="chart_id_simple_pie">Chart ID</label>
								<input
									id="chart_id_simple_pie"
									type="text"
									class="input-control"
									placeholder="Unique chart identifier"
									bind:value={chartId}
									maxlength="32"
								/>
							</div>

							<div class="border-t border-slate-200 pt-4">
								<Checkbox bind:checked={simplePieFilterEnabled} label="Filter data" />
							</div>

							{#if simplePieFilterEnabled}
								<div class="space-y-4 rounded-lg border border-slate-300 bg-white p-4">
									<Checkbox bind:checked={simplePieRegex} label="Use regex" />

									<div class="input-group">
										<label class="input-label" for="simplePieFilterMode">Filter mode</label>
										<select
											id="simplePieFilterMode"
											class="input-control"
											bind:value={simplePieFilterMode}
										>
											<option value="whitelist">Whitelist</option>
											<option value="blacklist">Blacklist</option>
										</select>
									</div>

									<div class="input-group">
										<label class="input-label" for="simplePieFilterValues"
											>{simplePieFilterMode === 'blacklist' ? 'Blacklist' : 'Whitelist'} values</label
										>
										<textarea
											id="simplePieFilterValues"
											class="input-control"
											rows="4"
											placeholder="One value per line"
											bind:value={simplePieFilterValues}
										></textarea>
									</div>
								</div>
							{/if}

							<Button type="button" onclick={() => addChart('simple_pie')} fullWidth>
								Create Chart
							</Button>
						</div>
					{/if}

					<!-- Advanced Pie Form -->
					{#if selectedChartType === 'advanced_pie'}
						<div class="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
							<div class="input-group">
								<label class="input-label" for="chart_title_advanced_pie">Chart title</label>
								<input
									id="chart_title_advanced_pie"
									type="text"
									class="input-control"
									placeholder="The title of the chart"
									bind:value={chartTitle}
									maxlength="32"
								/>
							</div>
							<div class="input-group">
								<label class="input-label" for="chart_id_advanced_pie">Chart ID</label>
								<input
									id="chart_id_advanced_pie"
									type="text"
									class="input-control"
									placeholder="Unique chart identifier"
									bind:value={chartId}
									maxlength="32"
								/>
							</div>

							<div class="border-t border-slate-200 pt-4">
								<Checkbox bind:checked={advancedPieFilterEnabled} label="Filter data" />
							</div>

							{#if advancedPieFilterEnabled}
								<div class="space-y-4 rounded-lg border border-slate-300 bg-white p-4">
									<div class="input-group">
										<label class="input-label" for="advancedPieMaxValue">Max value per slice</label>
										<input
											id="advancedPieMaxValue"
											type="text"
											class="input-control"
											placeholder="Leave empty for no filtering"
											bind:value={advancedPieMaxValue}
											maxlength="16"
										/>
									</div>

									<Checkbox bind:checked={advancedPieRegex} label="Use regex" />

									<div class="input-group">
										<label class="input-label" for="advancedPieFilterMode">Filter mode</label>
										<select
											id="advancedPieFilterMode"
											class="input-control"
											bind:value={advancedPieFilterMode}
										>
											<option value="whitelist">Whitelist</option>
											<option value="blacklist">Blacklist</option>
										</select>
									</div>

									<div class="input-group">
										<label class="input-label" for="advancedPieFilterValues"
											>{advancedPieFilterMode === 'blacklist' ? 'Blacklist' : 'Whitelist'} values</label
										>
										<textarea
											id="advancedPieFilterValues"
											class="input-control"
											rows="4"
											placeholder="One value per line"
											bind:value={advancedPieFilterValues}
										></textarea>
									</div>
								</div>
							{/if}

							<Button type="button" onclick={() => addChart('advanced_pie')} fullWidth>
								Create Chart
							</Button>
						</div>
					{/if}

					<!-- Drilldown Pie Form -->
					{#if selectedChartType === 'drilldown_pie'}
						<div class="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
							<div class="input-group">
								<label class="input-label" for="chart_title_drilldown_pie">Chart title</label>
								<input
									id="chart_title_drilldown_pie"
									type="text"
									class="input-control"
									placeholder="The title of the chart"
									bind:value={chartTitle}
									maxlength="32"
								/>
							</div>
							<div class="input-group">
								<label class="input-label" for="chart_id_drilldown_pie">Chart ID</label>
								<input
									id="chart_id_drilldown_pie"
									type="text"
									class="input-control"
									placeholder="Unique chart identifier"
									bind:value={chartId}
									maxlength="32"
								/>
							</div>

							<div class="border-t border-slate-200 pt-4">
								<Checkbox bind:checked={drilldownPieFilterEnabled} label="Filter data" />
							</div>

							{#if drilldownPieFilterEnabled}
								<div class="space-y-4 rounded-lg border border-slate-300 bg-white p-4">
									<div class="input-group">
										<label class="input-label" for="drilldownPieMaxValue">Max value per slice</label
										>
										<input
											id="drilldownPieMaxValue"
											type="text"
											class="input-control"
											placeholder="Leave empty for no filtering"
											bind:value={drilldownPieMaxValue}
											maxlength="16"
										/>
									</div>

									<Checkbox bind:checked={drilldownPieRegex} label="Use regex" />

									<div class="input-group">
										<label class="input-label" for="drilldownPieFilterMode">Filter mode</label>
										<select
											id="drilldownPieFilterMode"
											class="input-control"
											bind:value={drilldownPieFilterMode}
										>
											<option value="whitelist">Whitelist</option>
											<option value="blacklist">Blacklist</option>
										</select>
									</div>

									<div class="input-group">
										<label class="input-label" for="drilldownPieFilterValues"
											>{drilldownPieFilterMode === 'blacklist' ? 'Blacklist' : 'Whitelist'} values</label
										>
										<textarea
											id="drilldownPieFilterValues"
											class="input-control"
											rows="4"
											placeholder="One value per line"
											bind:value={drilldownPieFilterValues}
										></textarea>
									</div>
								</div>
							{/if}

							<Button type="button" onclick={() => addChart('drilldown_pie')} fullWidth>
								Create Chart
							</Button>
						</div>
					{/if}

					<!-- Single Line Chart Form -->
					{#if selectedChartType === 'single_linechart'}
						<div class="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
							<div class="input-group">
								<label class="input-label" for="chart_title_single_linechart">Chart title</label>
								<input
									id="chart_title_single_linechart"
									type="text"
									class="input-control"
									placeholder="The title of the chart"
									bind:value={chartTitle}
									maxlength="32"
								/>
							</div>
							<div class="input-group">
								<label class="input-label" for="chart_id_single_linechart">Chart ID</label>
								<input
									id="chart_id_single_linechart"
									type="text"
									class="input-control"
									placeholder="Unique chart identifier"
									bind:value={chartId}
									maxlength="32"
								/>
							</div>
							<div class="input-group">
								<label class="input-label" for="line_name_single_linechart">Line name</label>
								<input
									id="line_name_single_linechart"
									type="text"
									class="input-control"
									placeholder="The name of the line (e.g., 'Players')"
									bind:value={singleLineLineName}
									maxlength="50"
								/>
							</div>

							<div class="border-t border-slate-200 pt-4">
								<Checkbox bind:checked={singleLineFilterEnabled} label="Filter data" />
							</div>

							{#if singleLineFilterEnabled}
								<div class="space-y-4 rounded-lg border border-slate-300 bg-white p-4">
									<div class="input-group">
										<label class="input-label" for="singleLineMaxValue">Max value</label>
										<input
											id="singleLineMaxValue"
											type="text"
											class="input-control"
											placeholder="Leave empty for no filtering"
											bind:value={singleLineMaxValue}
											maxlength="16"
										/>
									</div>
									<div class="input-group">
										<label class="input-label" for="singleLineMinValue">Min value</label>
										<input
											id="singleLineMinValue"
											type="text"
											class="input-control"
											placeholder="Leave empty for no filtering"
											bind:value={singleLineMinValue}
											maxlength="16"
										/>
									</div>
								</div>
							{/if}

							<Button type="button" onclick={() => addChart('single_linechart')} fullWidth>
								Create Chart
							</Button>
						</div>
					{/if}
				</article>

				<!-- Edit Charts Card -->
				{#if sortedCharts.length > 0}
					<article class="doc-card space-y-4">
						<div>
							<h2 class="font-display text-xl font-semibold text-slate-900">Edit charts</h2>
							<p class="mt-1 text-sm text-slate-500">Drag to reorder, click to delete</p>
						</div>

						<ul
							class="space-y-2"
							use:dndzone={{ items: sortedCharts, flipDurationMs, dropTargetStyle: {} }}
							onconsider={handleDndConsider}
							onfinalize={handleDndFinalize}
						>
							{#each sortedCharts as item (item.id)}
								{@const chartId = item.chartId}
								<li
									animate:flip={{ duration: flipDurationMs }}
									class="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300"
								>
									<div
										class="cursor-move text-slate-400 hover:text-slate-600"
										title="Drag to reorder"
									>
										<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M4 8h16M4 16h16"
											/>
										</svg>
									</div>
									<div class="min-w-0 flex-1">
										<a
											href={resolve(
												`/plugin/${data.softwareUrl}/${data.plugin.name}/${data.plugin.id}#${chartId}`
											)}
											class="font-semibold text-slate-900 hover:text-brand-600"
										>
											{data.charts[chartId].title}
										</a>
										<span class="text-sm text-slate-500">(id: {chartId})</span>
									</div>
									{#if !data.charts[chartId].isDefault}
										<button
											type="button"
											onclick={() => deleteChart(chartId)}
											class="text-rose-600 hover:text-rose-700"
											title="Delete chart"
										>
											<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												/>
											</svg>
										</button>
									{:else}
										<span class="text-slate-300" title="Default chart cannot be deleted">
											<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												/>
											</svg>
										</span>
									{/if}
								</li>
							{/each}
						</ul>
					</article>
				{/if}

				<!-- Delete Plugin Card -->
				<article class="doc-card space-y-4">
					<div>
						<h2 class="font-display text-xl font-semibold text-rose-900">Delete plugin</h2>
						<p class="mt-1 text-sm text-rose-600">
							This action cannot be undone. All data will be permanently deleted.
						</p>
					</div>

					<div class="input-group">
						<label class="input-label" for="confirm_plugin_name">Type plugin name to confirm</label>
						<input
							id="confirm_plugin_name"
							type="text"
							class="input-control"
							placeholder={data.plugin.name}
							bind:value={deleteConfirmName}
						/>
					</div>

					<button
						type="button"
						class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-rose-600 px-6 py-3 text-base font-semibold text-white shadow-md transition-transform duration-200 hover:-translate-y-0.5 hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
						disabled={!deleteButtonEnabled}
						onclick={deletePlugin}
					>
						Delete Plugin
					</button>
				</article>

				<!-- Transfer Ownership Card (Admin Only) -->
				{#if data.user?.admin}
					<article class="doc-card space-y-4">
						<div>
							<h2 class="font-display text-xl font-semibold text-slate-900">Transfer ownership</h2>
							<p class="mt-1 text-sm text-slate-500">
								Move this plugin to a different user account
							</p>
						</div>

						<div class="input-group">
							<label class="input-label" for="new_owner">New owner username</label>
							<input
								id="new_owner"
								type="text"
								class="input-control"
								placeholder="Enter username"
								bind:value={newOwnerName}
							/>
						</div>

						<Button type="button" onclick={transferOwnership} fullWidth size="large">
							Transfer Ownership
						</Button>
					</article>
				{/if}
			</div>
		</section>
	{/if}
</main>
