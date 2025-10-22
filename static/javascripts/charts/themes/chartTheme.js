/**
 * Modern bStats theme for Highcharts JS
 * Matches Tailwind design system with emerald brand colors
 */

// Modern chart theme - no background image, clean slate-based design
if (window.__bstatsCustomLayout) {
    Highcharts.wrap(Highcharts.Chart.prototype, 'getContainer', function (proceed) {
        proceed.call(this);
        // No background - let the card background shine through
        this.container.style.background = 'transparent';
    });
}

Highcharts.theme = {
    // Brand colors - emerald palette
    colors: [
        "#10b981", // emerald-500 (brand)
        "#3b82f6", // blue-500
        "#f59e0b", // amber-500
        "#8b5cf6", // violet-500
        "#ec4899", // pink-500
        "#14b8a6", // teal-500
        "#f97316", // orange-500
        "#6366f1", // indigo-500
        "#a855f7", // purple-500
        "#06b6d4"  // cyan-500
    ],
    chart: {
        backgroundColor: 'transparent',
        style: {
            fontFamily: "Inter, sans-serif"
        }
    },
    title: {
        useHTML: true,
        style: {
            color: '#0f172a', // slate-900
            fontSize: '18px',
            fontWeight: '600',
            fontFamily: "Space Grotesk, sans-serif"
        }
    },
    credits: {
        enabled: false
    },
    subtitle: {
        style: {
            color: '#475569', // slate-600
            fontSize: '14px'
        }
    },
    tooltip: {
        borderWidth: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        shadow: {
            color: 'rgba(0, 0, 0, 0.1)',
            offsetX: 0,
            offsetY: 2,
            opacity: 0.1,
            width: 8
        },
        style: {
            color: '#1e293b', // slate-800
            fontSize: '13px'
        }
    },
    legend: {
        itemStyle: {
            fontWeight: '500',
            fontSize: '13px',
            color: '#475569' // slate-600
        },
        itemHoverStyle: {
            color: '#0f172a' // slate-900
        }
    },
    xAxis: {
        gridLineColor: '#e2e8f0', // slate-200
        labels: {
            style: {
                color: '#64748b', // slate-500
                fontSize: '12px'
            }
        },
        lineColor: '#cbd5e1', // slate-300
        tickColor: '#cbd5e1'
    },
    yAxis: {
        gridLineColor: '#e2e8f0', // slate-200
        labels: {
            style: {
                color: '#64748b', // slate-500
                fontSize: '12px'
            }
        },
        lineColor: '#cbd5e1',
        tickColor: '#cbd5e1',
        title: {
            style: {
                color: '#475569', // slate-600
                fontSize: '13px',
                fontWeight: '500'
            }
        }
    },
    plotOptions: {
        series: {
            shadow: false, // Modern flat design
            borderWidth: 0,
            dataLabels: {
                style: {
                    fontSize: '12px',
                    fontWeight: '500',
                    textOutline: 'none'
                }
            }
        },
        candlestick: {
            lineColor: '#64748b'
        },
        map: {
            shadow: false
        },
        line: {
            marker: {
                radius: 3
            }
        },
        spline: {
            marker: {
                radius: 3
            }
        }
    },

    // Highstock specific
    navigator: {
        xAxis: {
            gridLineColor: '#e2e8f0'
        },
        series: {
            color: '#10b981',
            lineColor: '#059669'
        }
    },
    rangeSelector: {
        buttonTheme: {
            fill: '#ffffff',
            stroke: '#cbd5e1',
            'stroke-width': 1,
            r: 8,
            style: {
                color: '#475569',
                fontWeight: '500'
            },
            states: {
                hover: {
                    fill: '#f1f5f9',
                    stroke: '#94a3b8'
                },
                select: {
                    fill: '#10b981',
                    stroke: '#059669',
                    style: {
                        color: '#ffffff',
                        fontWeight: '600'
                    }
                }
            }
        },
        inputBoxBorderColor: '#cbd5e1',
        inputStyle: {
            color: '#1e293b',
            fontWeight: '500'
        },
        labelStyle: {
            color: '#64748b',
            fontWeight: '500'
        }
    },
    scrollbar: {
        barBackgroundColor: '#cbd5e1',
        barBorderColor: '#cbd5e1',
        buttonBackgroundColor: '#94a3b8',
        buttonBorderColor: '#94a3b8',
        rifleColor: '#ffffff',
        trackBackgroundColor: '#f1f5f9',
        trackBorderColor: '#e2e8f0'
    },

    // General
    background2: '#f8fafc', // slate-50

    global: {
        useUTC: false
    }
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);
