import { z } from 'zod';
import { chartTypeOptions } from './chart-schema-fields';

export const addChartSchema = z.discriminatedUnion('chartType', [
    chartTypeOptions.simple_pie,
    chartTypeOptions.advanced_pie,
    chartTypeOptions.drilldown_pie,
    chartTypeOptions.simple_bar,
    chartTypeOptions.advanced_bar,
    chartTypeOptions.single_linechart
]);
