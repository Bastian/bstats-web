// Modern vanilla JS - listen for custom event from Svelte
document.addEventListener('bstats:charts-shell-ready', function(event) {
    const charts = event.detail || window.__bstatsCharts;
    if (!charts) {
        console.error('No charts data provided');
        return;
    }

    for (const chartId in charts) {
        if (!charts.hasOwnProperty(chartId)) {
            continue;
        }
        const chart = charts[chartId];
        switch (chart.type) {
            case 'simple_pie':
            case 'advanced_pie':
                handlePieChart(chartId, chart);
                break;
            case 'drilldown_pie':
                handleDrilldownPieChart(chartId, chart);
                break;
            case 'single_linechart':
                handleLineChart(chartId, chart);
                break;
            case 'simple_bar':
            case 'advanced_bar':
                handleBarChart(chartId, chart);
                break;
            case 'simple_map':
            case 'advanced_map':
                handleMapChart(chartId, chart);
                break;
            default:
                break;
        }
    }
});

function handlePieChart(chartId, chart) {
    const pluginId = window.getPluginId ? window.getPluginId() : null;
    if (!pluginId) {
        console.error('getPluginId function not found');
        return;
    }

    fetch('/api/v1/plugins/' + pluginId + '/charts/' + chartId + '/data')
        .then(response => response.json())
        .then(data => {
            if (data.length > 20) { // Make the chart smaller by hiding elements with less than 1%
                let total = 0;
                for (let i = 0; i < data.length; i++) {
                    total += data[i].y;
                }
                let otherCount = 0;
                for (let i = data.length - 1; i >= 0; i--) { // We loop backwards because we may remove some elements
                    if (data[i].y < total / 200) {
                        otherCount += data[i].y;
                        data.splice(i, 1);
                    }
                }
                if (otherCount > 0) {
                    data.push({name: "Other", y: otherCount});
                }
            }

            data.sort((a, b) => b.y - a.y);

            const container = document.getElementById(chartId + 'Pie');
            if (!container) {
                console.error('Chart container not found:', chartId + 'Pie');
                return;
            }

            const isMobile = window.innerWidth <= 600;

            Highcharts.chart(container, {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: chart.title
                },
                tooltip: {
                    headerFormat: '<span style="font-size: 18px"><u><b>{point.key}</b></u></span><br/>',
                    pointFormat: '<b>Share</b>: {point.percentage:.1f} %<br><b>Total</b>: {point.y}'
                },
                exporting: {
                    enabled: false
                },
                plotOptions: {
                    pie: {
                        size: 180,
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: !isMobile,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        },
                        showInLegend: isMobile
                    }
                },
                series: [{
                    name: chart.title,
                    colorByPoint: true,
                    data: data
                }]
            });
        })
        .catch(error => console.error('Error loading pie chart data:', error));
}

function handleDrilldownPieChart(chartId, chart) {
    const pluginId = window.getPluginId ? window.getPluginId() : null;
    if (!pluginId) {
        console.error('getPluginId function not found');
        return;
    }

    fetch('/api/v1/plugins/' + pluginId + '/charts/' + chartId + '/data')
        .then(response => response.json())
        .then(data => {
            for (let j = 0; j < data.drilldownData.length; j++) {
                if (data.drilldownData[j].data.length > 20) { // Make the chart smaller by hiding elements with less than 1%
                    let total = 0;
                    for (let i = 0; i < data.drilldownData[j].data.length; i++) {
                        total += data.drilldownData[j].data[i][1];
                    }
                    let otherCount = 0;
                    for (let i = data.drilldownData[j].data.length - 1; i >= 0; i--) { // We loop backwards because we may remove some elements
                        if (data.drilldownData[j].data[i][1] < total / 200) {
                            otherCount += data.drilldownData[j].data[i][1];
                            data.drilldownData[j].data.splice(i, 1);
                        }
                    }
                    if (otherCount > 0) {
                        data.drilldownData[j].data.push(["Other", otherCount]);
                    }

                    data.drilldownData[j].data.sort((a, b) => b[1] - a[1]);
                }
            }

            const container = document.getElementById(chartId + 'Pie');
            if (!container) {
                console.error('Chart container not found:', chartId + 'Pie');
                return;
            }

            const isMobile = window.innerWidth <= 600;

            Highcharts.chart(container, {
                chart: {
                    type: 'pie'
                },
                title: {
                    text: chart.title
                },
                subtitle: {
                    text: 'Click the slices to view details.'
                },
                plotOptions: {
                    pie: {
                        size: 180,
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: !isMobile,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        },
                        showInLegend: isMobile
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size: 18px"><u><b>{point.key}</b></u></span><br/>',
                    pointFormat: '<b>Share</b>: {point.percentage:.1f} %<br><b>Total</b>: {point.y}'
                },
                exporting: {
                    enabled: false
                },
                series: [{
                    name: chart.title,
                    colorByPoint: true,
                    data: data.seriesData
                }],
                drilldown: {
                    series: data.drilldownData
                }
            });
        })
        .catch(error => console.error('Error loading drilldown pie chart data:', error));
}

function handleLineChart(chartId, chart) {
    const pluginId = window.getPluginId ? window.getPluginId() : null;
    if (!pluginId) {
        console.error('getPluginId function not found');
        return;
    }

    const isMobile = window.innerWidth < 600;

    fetch('/api/v1/plugins/' + pluginId + '/charts/' + chartId + '/data/?maxElements=' + (2*24*31*1))
        .then(response => response.json())
        .then(data => {
            if (chartId === 'players' && window.updatePlayersBadge) {
                window.updatePlayersBadge(data);
            } else if (chartId === 'servers' && window.updateServersBadge) {
                window.updateServersBadge(data);
            }

            const container = document.getElementById(chartId + 'LineChart');
            if (!container) {
                console.error('Chart container not found:', chartId + 'LineChart');
                return;
            }

            Highcharts.stockChart(container, {
                chart:{
                    zoomType: 'x'
                },

                rangeSelector: {
                    buttons: [{
                        type: 'day',
                        count: 1,
                        text: '1d'
                    }, {
                        type: 'day',
                        count: 3,
                        text: '3d'
                    }, {
                        type: 'week',
                        count: 1,
                        text: '1w'
                    }, {
                        type: 'month',
                        count: 1,
                        text: '1m'
                    }, {
                        type: 'month',
                        count: 6,
                        text: '6m'
                    }, {
                        type: 'year',
                        count: 1,
                        text: '1y'
                    }, {
                        type: 'all',
                        text: 'All'
                    }],
                    selected: 3,
                    inputEnabled: false
                },

                exporting: {
                    menuItemDefinitions: {
                        loadFullData: {
                            onclick: function () {
                                fetch('/api/v1/plugins/' + pluginId + '/charts/' + chartId + '/data/?maxElements=' + (2*24*30*12*2))
                                    .then(response => response.json())
                                    .then(fullData => {
                                        const chartInstance = Highcharts.charts.find(c => c && c.renderTo === container);
                                        if (chartInstance) {
                                            chartInstance.series[0].update({
                                                data: fullData
                                            }, true);
                                        }
                                    });
                            },
                            text: 'Load full data'
                        }
                    },
                    buttons: {
                        contextButton: {
                            menuItems: ['loadFullData']
                        }
                    }
                },

                xAxis: {
                    ordinal: false
                },

                yAxis: {
                    min: 0,
                    labels: {
                        formatter: function () {
                            if (this.value % 1 != 0) {
                                return "";
                            } else {
                                return this.value;
                            }
                        }
                    }
                },

                title : {
                    text : chart.title
                },

                plotOptions:{
                    series: {
                        turboThreshold: 0 // disable the 1000 limit
                    }
                },

                series : [{
                    name : chart.data.lineName,
                    data : data,
                    type: 'spline',
                    tooltip: {
                        valueDecimals: 0
                    }
                }]
            });
        })
        .catch(error => console.error('Error loading line chart data:', error));
}

function handleBarChart(chartId, chart) {
    const pluginId = window.getPluginId ? window.getPluginId() : null;
    if (!pluginId) {
        console.error('getPluginId function not found');
        return;
    }

    fetch('/api/v1/plugins/' + pluginId + '/charts/' + chartId + '/data')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById(chartId + 'Bar');
            if (!container) {
                console.error('Chart container not found:', chartId + 'Bar');
                return;
            }

            Highcharts.chart(container, {
                chart: {
                    type: 'bar',
                    renderTo: 'container',
                    marginTop: 40,
                    marginBottom: 80,
                    height: data.length * chart.data.barNames.length * (30 + chart.data.barNames.length * 15) + 120 // 20px per data item plus top and bottom margins
                },
                title: {
                    text: chart.title
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        pointWidth: 25
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size: 18px"><u><b>{point.key}</b></u></span><br/>',
                    pointFormat: '<b>Total</b>: {point.y} ' + chart.data.valueName
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -40,
                    y: 80,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                    shadow: true
                },
                exporting: {
                    enabled: false
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: chart.data.valueName,
                        align: 'high'
                    },
                    labels: {
                        overflow: 'justify'
                    }
                },
                xAxis: {
                    categories: data.map(d => d.name)
                },
                series: chart.data.barNames.map((barName, index) => ({
                    name: barName,
                    data: data.map(d => d.data[index])
                }))
            });
        })
        .catch(error => console.error('Error loading bar chart data:', error));
}

function handleMapChart(chartId, chart) {
    const pluginId = window.getPluginId ? window.getPluginId() : null;
    if (!pluginId) {
        console.error('getPluginId function not found');
        return;
    }

    fetch('/api/v1/plugins/' + pluginId + '/charts/' + chartId + '/data')
        .then(response => response.json())
        .then(data => {
            // Add lower case codes to the data set for inclusion in the tooltip.pointFormat
            data.forEach(item => {
                item.flag = item.code.replace('UK', 'GB').toLowerCase();
            });

            const container = document.getElementById(chartId + 'Map');
            if (!container) {
                console.error('Chart container not found:', chartId + 'Map');
                return;
            }

            // Initiate the chart
            Highcharts.mapChart(container, {
                title: {
                    text: chart.title
                },

                legend: {
                    title: {
                        text: chart.data.valueName,
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                        }
                    }
                },

                exporting: {
                    enabled: false
                },

                mapNavigation: {
                    enabled: true,
                    enableMouseWheelZoom: false,
                    buttonOptions: {
                        verticalAlign: 'bottom'
                    }
                },

                tooltip: {
                    backgroundColor: 'none',
                    borderWidth: 0,
                    shadow: false,
                    useHTML: true,
                    padding: 0,
                    pointFormat: '<span class="f32"><span class="flag {point.flag}"></span></span>' +
                    ' {point.name}: <b>{point.value}</b>',
                    positioner: function () {
                        return { x: 0, y: 250 };
                    }
                },

                colorAxis: {
                    min: 1,
                    max: 5000,
                    type: 'logarithmic',
                    minColor: '#FFCDD2',
                    maxColor: '#B71C1C'
                },

                series : [{
                    data : data,
                    mapData: Highcharts.maps['custom/world'],
                    joinBy: ['iso-a2', 'code'],
                    name: chart.data.valueName,
                    color: '#F44336',
                    shadow: false,
                    states: {
                        hover: {
                            color: '#B71C1C'
                        }
                    }
                }]
            });
        })
        .catch(error => console.error('Error loading map chart data:', error));
}