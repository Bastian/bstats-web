/**
 * bStats theme for Apache ECharts
 * Matches Tailwind design system with emerald brand colors
 */

import type { EChartsOption } from 'echarts';

export function getEChartsTheme() {
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

        // Text styles
        textStyle: {
            fontFamily: 'Inter, sans-serif',
            color: '#64748b' // slate-500
        },

        // Title
        title: {
            textStyle: {
                color: '#0f172a', // slate-900
                fontSize: 18,
                fontWeight: 600,
                fontFamily: 'Space Grotesk, sans-serif'
            },
            subtextStyle: {
                color: '#475569', // slate-600
                fontSize: 14
            }
        },

        // Legend
        legend: {
            textStyle: {
                color: '#475569', // slate-600
                fontSize: 13,
                fontWeight: 500
            }
        },

        // Tooltip
        tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            borderWidth: 0,
            textStyle: {
                color: '#1e293b', // slate-800
                fontSize: 13
            },
            shadowBlur: 8,
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowOffsetX: 0,
            shadowOffsetY: 2
        },

        // Axes
        xAxis: {
            axisLine: {
                lineStyle: {
                    color: '#cbd5e1' // slate-300
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#e2e8f0' // slate-200
                }
            },
            axisLabel: {
                color: '#64748b', // slate-500
                fontSize: 12
            },
            nameTextStyle: {
                color: '#475569', // slate-600
                fontSize: 13,
                fontWeight: 500
            }
        },
        yAxis: {
            axisLine: {
                lineStyle: {
                    color: '#cbd5e1' // slate-300
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#e2e8f0' // slate-200
                }
            },
            axisLabel: {
                color: '#64748b', // slate-500
                fontSize: 12
            },
            nameTextStyle: {
                color: '#475569', // slate-600
                fontSize: 13,
                fontWeight: 500
            }
        }
    } as const satisfies EChartsOption;
}
