import { z } from 'zod';

const common = {
    chartId: z
        .string()
        .trim()
        .nonempty('Must not be empty')
        .max(50)
        .regex(/^\S*$/, 'Must not contain spaces')
        .regex(/^[a-zA-Z0-9_ ]*$/, 'Can only contain letters, numbers, and underscores'),
    chartTitle: z
        .string()
        .trim()
        .nonempty('Must not be empty')
        .max(50)
        .regex(/^(?!.*\s{2,})/, 'Must not contain double spaces')
        .regex(/^[-_a-zA-Z0-9 ]*$/, 'Can only contain letters, numbers, dashes and underscores'),
    filterEnabled: z.boolean().default(false)
};

export const addChartSchema = z.discriminatedUnion('chartType', [
    z.object({
        chartType: z.literal('simple_pie'),
        ...common,
        blacklistEnabled: z.boolean().default(false),
        regexEnabled: z.boolean().default(false),
        filter: z.array(z.string()).default([])
    }),
    z.object({
        chartType: z.literal('advanced_pie'),
        ...common,
        blacklistEnabled: z.boolean().default(false),
        regexEnabled: z.boolean().default(false),
        maxValue: z.number().min(0).optional(),
        filter: z.array(z.string()).default([])
    }),
    z.object({
        chartType: z.literal('drilldown_pie'),
        ...common,
        blacklistEnabled: z.boolean().default(false),
        regexEnabled: z.boolean().default(false),
        maxValue: z.number().min(0).optional(),
        filter: z.array(z.string()).default([])
    }),
    z.object({
        chartType: z.literal('single_linechart'),
        ...common,
        lineName: z
            .string()
            .trim()
            .nonempty('Must not be empty')
            .max(50)
            .regex(/^(?!.*\s{2,})/, 'Must not contain double spaces')
            .regex(
                /^[-_a-zA-Z0-9 ]*$/,
                'Can only contain letters, numbers, dashes and underscores'
            ),
        maxValue: z.int().default(1_000),
        minValue: z.int().default(0)
    })
]);
