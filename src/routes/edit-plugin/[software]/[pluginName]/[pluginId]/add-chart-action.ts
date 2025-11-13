import { createChart, getChartByPluginIdAndChartId } from '$lib/server/redis/charts.js';
import { getPluginById, updatePluginCharts, type Plugin } from '$lib/server/redis/plugins.js';
import { fail } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Action } from './$types';
import { addChartSchema } from './add-chart-schema';

interface ChartData {
    type: string;
    id: string;
    position: number;
    isDefault: boolean;
    title: string;
    data: Record<string, unknown>;
}

export const addChart = (async ({ request, locals, params }) => {
    if (!locals.user) {
        return fail(401, { error: 'Not authenticated' });
    }

    const form = await superValidate(request, zod4(addChartSchema));

    if (!form.valid) {
        return fail(400, { form });
    }

    const { pluginId } = params;
    const plugin = await getPluginById(parseInt(pluginId));

    if (!plugin) {
        return fail(404, { form, error: 'Plugin not found' });
    }

    if (plugin.owner?.toLowerCase() !== locals.user.username && locals.user.role !== 'admin') {
        return fail(401, { form, error: 'You are not allowed to edit this plugin' });
    }

    const existingChart = await getChartByPluginIdAndChartId(parseInt(pluginId), form.data.chartId);

    if (existingChart) {
        return setError(form, 'chartId', 'Chart with this id already exists');
    }

    const chartData: ChartData = {
        type: form.data.chartType,
        id: form.data.chartId,
        position: plugin.charts.length,
        isDefault: false,
        title: form.data.chartTitle,
        data: {}
    };

    switch (form.data.chartType) {
        case 'simple_pie':
            chartData.data = {
                enabled: form.data.filterEnabled,
                useRegex: form.data.regexEnabled,
                blacklist: form.data.blacklistEnabled,
                filter: form.data.filter
            };
            break;
        case 'advanced_pie':
        case 'drilldown_pie':
            chartData.data = {
                enabled: form.data.filterEnabled,
                maxValue: form.data.maxValue,
                useRegex: form.data.regexEnabled,
                blacklist: form.data.blacklistEnabled,
                filter: form.data.filter
            };
            break;
        case 'single_linechart':
            chartData.data = {
                lineName: form.data.lineName,
                enabled: form.data.filterEnabled,
                minValue: form.data.minValue,
                maxValue: form.data.maxValue
            };
            break;
        default:
            return fail(400, { form, error: 'Invalid chart type' });
    }

    try {
        await saveChart(plugin, chartData);
    } catch (err) {
        console.error('Error saving chart:', err);
        return fail(500, { error: 'Unknown error' });
    }

    return message(form, 'Form posted successfully!');
}) satisfies Action;

async function saveChart(plugin: Plugin, chartData: ChartData): Promise<void> {
    const chartUid = await createChart(plugin.id, {
        id: chartData.id,
        type: chartData.type,
        position: chartData.position,
        title: chartData.title,
        isDefault: chartData.isDefault,
        data: chartData.data
    });

    plugin.charts.push(chartUid);
    await updatePluginCharts(plugin.id, plugin.charts);
}
