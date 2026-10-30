import {
    getPluginById,
    getPluginBySoftwareUrlAndName,
    updatePluginName as renamePlugin
} from '$lib/server/redis/plugins.js';
import { getSoftwareById } from '$lib/server/redis/software.js';
import { fail, redirect } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Action } from './$types';
import { updatePluginNameSchema } from './update-plugin-name-schema';

export const updatePluginName = (async ({ request, locals, params }) => {
    if (!locals.user) {
        return fail(401, { error: 'Not authenticated' });
    }

    const form = await superValidate(request, zod4(updatePluginNameSchema));

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

    // Use the canonical software URL from Redis instead of trusting the URL
    // parameter, so duplicate checks always use the right index.
    const software = await getSoftwareById(plugin.software);

    const newName = form.data.name;

    if (newName === plugin.name) {
        return message(form, 'The plugin name is unchanged.');
    }

    const existing = await getPluginBySoftwareUrlAndName(software.url, newName);

    // Allow the plugin's own name (e.g. when only the casing changes).
    if (existing && existing.id !== plugin.id) {
        return setError(form, 'name', 'A plugin with this name already exists');
    }

    try {
        await renamePlugin(plugin.id, software.url, plugin.name, newName);
    } catch (err) {
        console.error('Error renaming plugin:', err);
        return fail(500, { form, error: 'Unknown error' });
    }

    throw redirect(303, `/edit-plugin/${software.url}/${encodeURIComponent(newName)}/${plugin.id}`);
}) satisfies Action;
