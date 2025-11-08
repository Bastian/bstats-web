import { getPluginById, transferPluginOwnership } from '$lib/server/redis/plugins.js';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Action } from './$types';
import { transferOwnershipSchema } from './transfer-ownership-schema';

export const transferOwnership = (async ({ request, locals, params }) => {
    if (!locals.user) {
        return fail(401, { error: 'Not authenticated' });
    }

    const form = await superValidate(request, zod4(transferOwnershipSchema));

    const { pluginId } = params;
    const plugin = await getPluginById(parseInt(pluginId));

    if (!plugin) {
        return fail(404, { form, error: 'Plugin not found' });
    }

    if (!locals.user.admin) {
        return fail(401, {
            form,
            error: 'You are not allowed to transfer ownership of this plugin'
        });
    }

    if (!form.valid) {
        return fail(400, { form });
    }

    await transferPluginOwnership(parseInt(pluginId), plugin.owner!, form.data.ownerName);
    return message(form, 'Form posted successfully!');
}) satisfies Action;
