import { deleteChartLineData } from '$lib/server/redis/chart-data.js';
import {
    deleteChart,
    deleteChartIndex,
    getChartByPluginIdAndChartId,
    getChartByUid,
    getChartsByPluginId,
    removeChartFromUids,
    updateChartPosition
} from '$lib/server/redis/charts.js';
import { getPluginById, updatePluginCharts } from '$lib/server/redis/plugins.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { addChart } from './add-chart-action';
import { addChartSchema } from './add-chart-schema';
import { deletePlugin } from './delete-plugin-action';
import { deletePluginSchema } from './delete-plugin-schema';
import { transferOwnership } from './transfer-ownership-action';
import { transferOwnershipSchema } from './transfer-ownership-schema';

interface ChartInfo {
    uid?: number;
    id?: string;
    type?: string;
    position?: number;
    title?: string;
    isDefault?: boolean;
    data?: Record<string, unknown>;
}

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    const { software: softwareUrl, pluginName, pluginId } = params;

    // Get plugin data
    const plugin = await getPluginById(parseInt(pluginId));

    if (!plugin) {
        throw error(404, 'Plugin not found');
    }

    // Redirect if plugin name doesn't match
    if (plugin.name !== pluginName) {
        throw redirect(303, `/editPlugin/${softwareUrl}/${plugin.name}/${pluginId}`);
    }

    // Check ownership
    const isOwner = plugin.owner?.toLowerCase() === locals.user.username;
    const canEdit = isOwner || locals.user.admin;

    // Get all charts for the plugin
    const chartsArray = await Promise.all(
        plugin.charts.map(async (chartUid: number) => {
            const chart = await getChartByUid(chartUid);
            return {
                uid: chart?.uid,
                id: chart?.id,
                type: chart?.type,
                position: chart?.position,
                title: chart?.title,
                isDefault: chart?.default,
                data: chart?.data
            };
        })
    );

    // Convert charts array to object keyed by chart id
    const charts: Record<string, ChartInfo> = {};
    for (const chart of chartsArray) {
        if (chart.id) {
            charts[chart.id] = {
                uid: chart.uid,
                type: chart.type,
                position: chart.position,
                title: chart.title,
                isDefault: chart.isDefault,
                data: chart.data as Record<string, unknown> | undefined
            };
        }
    }

    return {
        plugin,
        isOwner,
        canEdit,
        charts,
        softwareUrl,
        addChartSchema: await superValidate(zod4(addChartSchema)),
        deletePluginSchema: await superValidate(zod4(deletePluginSchema(plugin.name))),
        transferOwnershipSchema: await superValidate(zod4(transferOwnershipSchema))
    };
};

export const actions = {
    addChart,

    deleteChart: async ({ request, locals, params }) => {
        if (!locals.user) {
            return fail(401, { error: 'Not authenticated' });
        }

        const { pluginId } = params;
        const formData = await request.formData();
        const chartId = formData.get('chartId')?.toString();

        if (!chartId) {
            return fail(400, { error: 'Missing or invalid chart id' });
        }

        const plugin = await getPluginById(parseInt(pluginId));

        if (!plugin) {
            return fail(404, { error: 'Plugin not found' });
        }

        if (plugin.owner?.toLowerCase() !== locals.user.username && !locals.user.admin) {
            return fail(401, { error: 'You are not allowed to edit this plugin' });
        }

        const chart = await getChartByPluginIdAndChartId(parseInt(pluginId), chartId);

        if (!chart) {
            return fail(404, { error: 'Unknown chart!' });
        }

        if (chart.default) {
            return fail(403, { error: 'You are not allowed to delete default charts!' });
        }

        // Delete chart
        await deleteChart(chart.uid);

        // Remove from plugin's charts array
        const index = plugin.charts.indexOf(chart.uid);
        if (index !== -1) {
            plugin.charts.splice(index, 1);
        }
        await updatePluginCharts(parseInt(pluginId), plugin.charts);

        // Update positions of remaining charts
        const allCharts = (await getChartsByPluginId(parseInt(pluginId))) || [];

        for (const c of allCharts) {
            if (c.position! > chart.position!) {
                await updateChartPosition(c.uid!, c.position! - 1);
            }
        }

        // Delete chart indexes
        await deleteChartIndex(parseInt(pluginId), chartId);
        await removeChartFromUids(chart.uid);

        // Delete chart data if single_linechart
        if (chart.type === 'single_linechart') {
            await deleteChartLineData(chart.uid);
        }

        return { success: true };
    },

    reorderCharts: async ({ request, locals, params }) => {
        if (!locals.user) {
            return fail(401, { error: 'Not authenticated' });
        }

        const { pluginId } = params;
        const formData = await request.formData();
        const oldIndex = parseInt(formData.get('oldIndex')?.toString() || '');
        const newIndex = parseInt(formData.get('newIndex')?.toString() || '');

        if (isNaN(oldIndex) || isNaN(newIndex)) {
            return fail(400, { error: 'Invalid arguments' });
        }

        const plugin = await getPluginById(parseInt(pluginId));

        if (!plugin) {
            return fail(404, { error: 'Plugin not found' });
        }

        if (plugin.owner?.toLowerCase() !== locals.user.username && !locals.user.admin) {
            return fail(401, { error: 'You are not allowed to edit this plugin' });
        }

        const charts = (await getChartsByPluginId(parseInt(pluginId))) || [];

        for (const chart of charts) {
            if (oldIndex > newIndex) {
                if (chart.position! >= newIndex && chart.position! < oldIndex) {
                    await updateChartPosition(chart.uid!, chart.position! + 1);
                }
            }
            if (oldIndex < newIndex) {
                if (chart.position! > oldIndex && chart.position! <= newIndex) {
                    await updateChartPosition(chart.uid!, chart.position! - 1);
                }
            }
            if (chart.position === oldIndex) {
                await updateChartPosition(chart.uid!, newIndex);
            }
        }

        return { success: true };
    },

    deletePlugin,
    transferOwnership
} satisfies Actions;
