import { z } from 'zod';

export const deletePluginSchema = (pluginName: string) =>
    z.object({
        pluginName: z.literal(pluginName, 'Name does not match').default('')
    });
