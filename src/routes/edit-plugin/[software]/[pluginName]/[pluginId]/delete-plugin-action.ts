import {
    deletePlugin as deletePluginById,
    deletePluginIndex,
    getPluginById,
    removePluginFromPluginIds,
    removePluginFromUser
} from '$lib/server/redis/plugins.js';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Action } from './$types';
import { deletePluginSchema } from './delete-plugin-schema';
import {
    deleteChart,
    deleteChartIndex,
    getChartByUid,
    removeChartFromUids
} from '$lib/server/redis/charts';
import { deleteChartLineData } from '$lib/server/redis/chart-data';

export const deletePlugin = (async ({ request, locals, params }) => {
    if (!locals.user) {
        return fail(401, { error: 'Not authenticated' });
    }

    const { pluginId, software: softwareUrl } = params;
    const plugin = await getPluginById(parseInt(pluginId));

    if (!plugin) {
        return fail(404, { error: 'Plugin not found' });
    }

    const form = await superValidate(request, zod4(deletePluginSchema(plugin.name)));

    if (plugin.owner.toLowerCase() !== locals.user.username && locals.user.role !== 'admin') {
        return fail(401, { form, error: 'You are not allowed to delete this plugin' });
    }

    if (!form.valid) {
        return fail(400, { form });
    }

    // Delete plugin from sets and hashes
    await removePluginFromPluginIds(parseInt(pluginId));
    await deletePluginById(parseInt(pluginId));
    await deletePluginIndex(softwareUrl, plugin.name!);
    await removePluginFromUser(plugin.owner, parseInt(pluginId));

    // Delete all charts
    for (const chartUid of plugin.charts as number[]) {
        const chart = await getChartByUid(chartUid);

        if (chart) {
            await deleteChartIndex(parseInt(pluginId), chart.id!);
            await deleteChart(chartUid);
            await removeChartFromUids(chartUid);

            if (chart.type === 'single_linechart') {
                await deleteChartLineData(chartUid);
            }
        }
    }

    throw redirect(303, '/');
}) satisfies Action;
