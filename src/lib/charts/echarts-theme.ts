/**
 * bStats theme for Apache ECharts
 * Matches Tailwind design system with emerald brand colors
 */

import type { EChartsOption } from 'echarts';

export function getEChartsTheme(dark = false) {
    return {
        // Brand colors - emerald palette
        color: [
            '#10b981', // emerald-500 (brand)
            '#3b82f6', // blue-500
            '#f59e0b', // amber-500
            '#8b5cf6', // violet-500
            '#ec4899', // pink-500
            '#14b8a6', // teal-500
            '#f97316', // orange-500
            '#6366f1', // indigo-500
            '#a855f7', // purple-500
            '#06b6d4' // cyan-500
        ],

        // Background
        backgroundColor: 'transparent',

        // Text styles (slate for text — good contrast on dark surfaces)
        textStyle: {
            fontFamily: 'Inter, sans-serif',
            color: dark ? '#94a3b8' : '#64748b' // slate-400 / slate-500
        },

        // Title
        title: {
            textStyle: {
                color: dark ? '#f1f5f9' : '#0f172a', // slate-100 / slate-900
                fontSize: 18,
                fontWeight: 600,
                fontFamily: 'Space Grotesk, sans-serif'
            },
            subtextStyle: {
                color: dark ? '#94a3b8' : '#475569', // slate-400 / slate-600
                fontSize: 14
            }
        },

        // Legend
        legend: {
            textStyle: {
                color: dark ? '#94a3b8' : '#475569', // slate-400 / slate-600
                fontSize: 13,
                fontWeight: 500
            }
        },

        // Tooltip (dark palette for surface)
        tooltip: {
            backgroundColor: dark ? 'rgba(15, 17, 26, 0.96)' : 'rgba(255, 255, 255, 0.96)', // dark-900
            borderWidth: 0,
            textStyle: {
                color: dark ? '#e2e8f0' : '#1e293b', // slate-200 / slate-800
                fontSize: 13
            },
            shadowBlur: 8,
            shadowColor: dark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)',
            shadowOffsetX: 0,
            shadowOffsetY: 2
        },

        // Axes (dark palette for lines, slate for labels)
        xAxis: {
            axisLine: {
                lineStyle: {
                    color: dark ? '#2e3038' : '#cbd5e1' // dark-600 / slate-300
                }
            },
            splitLine: {
                lineStyle: {
                    color: dark ? '#252732' : '#e2e8f0' // dark-700 / slate-200
                }
            },
            axisLabel: {
                color: dark ? '#94a3b8' : '#64748b', // slate-400 / slate-500
                fontSize: 12
            },
            nameTextStyle: {
                color: dark ? '#94a3b8' : '#475569', // slate-400 / slate-600
                fontSize: 13,
                fontWeight: 500
            }
        },
        yAxis: {
            axisLine: {
                lineStyle: {
                    color: dark ? '#2e3038' : '#cbd5e1' // dark-600 / slate-300
                }
            },
            splitLine: {
                lineStyle: {
                    color: dark ? '#252732' : '#e2e8f0' // dark-700 / slate-200
                }
            },
            axisLabel: {
                color: dark ? '#94a3b8' : '#64748b', // slate-400 / slate-500
                fontSize: 12
            },
            nameTextStyle: {
                color: dark ? '#94a3b8' : '#475569', // slate-400 / slate-600
                fontSize: 13,
                fontWeight: 500
            }
        }
    } as const satisfies EChartsOption;
}
