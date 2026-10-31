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
    const form = await superValidate(request, zod4(updatePluginNameSchema));

    // Errors go on the name field, since the form doesn't render anything else.
    if (!locals.user) {
        return setError(form, 'name', 'Not authenticated', { status: 401 });
    }

    if (!form.valid) {
        return fail(400, { form });
    }

    const plugin = await getPluginById(parseInt(params.pluginId));

    if (!plugin) {
        return setError(form, 'name', 'Plugin not found', { status: 404 });
    }

    if (plugin.owner?.toLowerCase() !== locals.user.username && locals.user.role !== 'admin') {
        return setError(form, 'name', 'You are not allowed to edit this plugin', { status: 401 });
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
        return setError(form, 'name', 'Unknown error', { status: 500 });
    }

    throw redirect(303, `/edit-plugin/${software.url}/${encodeURIComponent(newName)}/${plugin.id}`);
}) satisfies Action;
