import type { SimplePieChartData } from "./simple-pie-chart-data.interface";
import type { AdvancedPieChartData } from "./advanced-pie-chart-data.interface";
import type { DrilldownPieChartData } from "./drilldown-pie-chart-data.interface";
import type { SingleLineChartData } from "./single-line-chart-data.interface";
import type { SimpleMapChartData } from "./simple-map-chart-data.interface";
import type { BarChartData } from "./bar-chart-data.interface";

export type ChartData =
  | SimplePieChartData
  | AdvancedPieChartData
  | DrilldownPieChartData
  | SingleLineChartData
  | SimpleMapChartData
  | BarChartData;
