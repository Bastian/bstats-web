import { z } from 'zod';

export const updatePluginNameSchema = z.object({
    name: z
        .string()
        .trim()
        .nonempty('Must not be empty')
        .max(48, 'Must be 48 characters or less')
        .regex(
            /^[-_a-zA-Z0-9 ]+(\s[-_a-zA-Z0-9 ]+)*$/,
            'Can only contain letters, numbers, dashes and underscores'
        )
});
