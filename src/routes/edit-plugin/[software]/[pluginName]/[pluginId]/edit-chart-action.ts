import {
    getChartByPluginIdAndChartId,
    getChartByUid,
    updateChart,
    updateChartIdIndex
} from '$lib/server/redis/charts.js';
import { getPluginById } from '$lib/server/redis/plugins.js';
import { fail } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Action } from './$types';
import { buildChartData } from './chart-data';
import { editChartSchema } from './edit-chart-schema';

export const editChart = (async ({ request, locals, params }) => {
    if (!locals.user) {
        return fail(401, { error: 'Not authenticated' });
    }

    const form = await superValidate(request, zod4(editChartSchema));

    if (!form.valid) {
        return fail(400, { form });
    }

    const plugin = await getPluginById(parseInt(params.pluginId));

    if (!plugin) {
        return fail(404, { form, error: 'Plugin not found' });
    }

    if (plugin.owner?.toLowerCase() !== locals.user.username && locals.user.role !== 'admin') {
        return fail(401, { form, error: 'You are not allowed to edit this plugin' });
    }

    const chart = await getChartByUid(form.data.chartUid);

    // Only charts that belong to this plugin may be edited.
    if (!chart || !plugin.charts.includes(chart.uid)) {
        return fail(404, { form, error: 'Chart not found' });
    }

    // Default charts are wired up by the bStats backend, so their identity is
    // fixed even though their title and settings can be changed.
    if (chart.default && form.data.chartType !== chart.type) {
        return setError(form, 'chartType', 'The chart type of default charts cannot be changed');
    }

    if (chart.default && form.data.chartId !== chart.id) {
        return setError(form, 'chartId', 'The chart ID of default charts cannot be changed');
    }

    if (form.data.chartId !== chart.id) {
        const existing = await getChartByPluginIdAndChartId(plugin.id, form.data.chartId);

        if (existing && existing.uid !== chart.uid) {
            return setError(form, 'chartId', 'Chart with this id already exists');
        }
    }

    try {
        await updateChartIdIndex(plugin.id, chart.id, form.data.chartId, chart.uid);
        await updateChart(chart.uid, {
            id: form.data.chartId,
            type: form.data.chartType,
            title: form.data.chartTitle,
            data: buildChartData(form.data)
        });
    } catch (err) {
        console.error('Error updating chart:', err);
        return fail(500, { form, error: 'Unknown error' });
    }

    return message(form, 'Chart updated successfully.');
}) satisfies Action;
