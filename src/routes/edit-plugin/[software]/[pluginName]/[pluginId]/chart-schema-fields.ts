import { z } from 'zod';

/*
 * Shared field definitions for chart creation and editing.
 *
 * Editing accepts unchanged legacy values that break these rules, but checks
 * changed values against them (see edit-chart-schema.ts).
 */

export const chartIdField = z
    .string()
    .trim()
    .nonempty('Must not be empty')
    .max(50)
    .regex(/^\S*$/, 'Must not contain spaces')
    .regex(/^[a-zA-Z0-9_ ]*$/, 'Can only contain letters, numbers, and underscores');

export const chartTitleField = z
    .string()
    .trim()
    .nonempty('Must not be empty')
    .max(50)
    .regex(/^(?!.*\s{2,})/, 'Must not contain double spaces')
    .regex(/^[-_a-zA-Z0-9 ]*$/, 'Can only contain letters, numbers, dashes and underscores');

export const lineNameField = z
    .string()
    .trim()
    .nonempty('Must not be empty')
    .max(50)
    .regex(/^(?!.*\s{2,})/, 'Must not contain double spaces')
    .regex(/^[-_a-zA-Z0-9 ]*$/, 'Can only contain letters, numbers, dashes and underscores');

const common = {
    chartId: chartIdField,
    chartTitle: chartTitleField,
    filterEnabled: z.boolean().default(false)
};

export const chartTypeOptions = {
    simple_pie: z.object({
        chartType: z.literal('simple_pie'),
        ...common,
        blacklistEnabled: z.boolean().default(false),
        regexEnabled: z.boolean().default(false),
        filter: z.array(z.string()).default([])
    }),
    advanced_pie: z.object({
        chartType: z.literal('advanced_pie'),
        ...common,
        blacklistEnabled: z.boolean().default(false),
        regexEnabled: z.boolean().default(false),
        maxValue: z.number().min(0).optional(),
        filter: z.array(z.string()).default([])
    }),
    drilldown_pie: z.object({
        chartType: z.literal('drilldown_pie'),
        ...common,
        blacklistEnabled: z.boolean().default(false),
        regexEnabled: z.boolean().default(false),
        maxValue: z.number().min(0).optional(),
        filter: z.array(z.string()).default([])
    }),
    simple_bar: z.object({
        chartType: z.literal('simple_bar'),
        ...common,
        valueName: z
            .string()
            .trim()
            .max(50)
            .regex(/^[-_a-zA-Z0-9 ]*$/, 'Can only contain letters, numbers, dashes and underscores')
            .default(''),
        orientation: z.enum(['horizontal', 'vertical']).default('horizontal')
    }),
    advanced_bar: z.object({
        chartType: z.literal('advanced_bar'),
        ...common,
        valueName: z
            .string()
            .trim()
            .max(50)
            .regex(/^[-_a-zA-Z0-9 ]*$/, 'Can only contain letters, numbers, dashes and underscores')
            .default(''),
        orientation: z.enum(['horizontal', 'vertical']).default('horizontal'),
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
    single_linechart: z.object({
        chartType: z.literal('single_linechart'),
        ...common,
        lineName: lineNameField,
        // i32 like the data processor; null (empty field) means no bound
        maxValue: z.int32().nullable().default(1_000),
        minValue: z.int32().nullable().default(0)
    })
};
