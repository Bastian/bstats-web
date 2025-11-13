import { z } from 'zod';

export const transferOwnershipSchema = z.object({
    ownerName: z.string().min(1).max(100).default('')
});
