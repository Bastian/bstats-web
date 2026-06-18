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
        chartType: z.literal('simple_bar'),
        ...common,
        valueName: z
            .string()
            .trim()
            .max(50)
            .regex(/^[-_a-zA-Z0-9 ]*$/, 'Can only contain letters, numbers, dashes and underscores')
            .default('')
    }),
    z.object({
        chartType: z.literal('advanced_bar'),
        ...common,
        valueName: z
            .string()
            .trim()
            .max(50)
            .regex(/^[-_a-zA-Z0-9 ]*$/, 'Can only contain letters, numbers, dashes and underscores')
            .default(''),
        // Display labels for each bar, by index (bar 1 = barLabels[0], ...).
        barLabels: z
            .array(
                z
                    .string()
                    .trim()
                    .max(50)
                    .regex(
                        /^[-_a-zA-Z0-9 ]*$/,
                        'Can only contain letters, numbers, dashes and underscores'
                    )
            )
            .max(25)
            .default([])
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
